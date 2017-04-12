'use strict';
var path = require('path');
const webpack = require('webpack');
const dora = require('dora');
const open = require('open');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const envCheck = require('./util/EnvCheck.js');
const Launch = require('./util/Launch.js');
const Promise = require('promise');
const spawn = require('cross-spawn');
const request = require('request');
const co = require('co');
var DebugServer = require('weex-devtool/lib/DebugServer.js');

const checkList = co.wrap(function* () {
  var flagXcode = yield envCheck.checkXcode();
  var flagSim = [];
  flagXcode ? flagSim = yield envCheck.checkIosSimulator() : false;
  var result = {
    xcode: flagXcode,
    iosSimulator: flagSim,
    weexToolkit: yield envCheck.checkWeexToolkit(),
    mds: envCheck.mds()
  };
  return result;
})

module.exports = function (webpackConfig, option) {
  DebugServer.start(8088);
  var qap = false;
  checkList().then((result) => {
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
      filename: 'run.html',
      template: path.resolve(__dirname, 'tpl/run.ejs'),
      entry: webpackConfig.entry,
      publicPath: webpackConfig.output.publicPath,
      xcode: result.xcode,
      mds: result.mds,
      iosSimulator: result.iosSimulator,
      weexToolkit: result.weexToolkit,
      qap: envCheck.qap(),
      chunks: [],
    }));

    webpackConfig.plugins.push(new HtmlWebpackPlugin({
      filename: 'h5.html',
      template: path.resolve(__dirname, 'tpl/h5.html'),
      chunks: [],
    }));

    dora({
      port: option.port,
      plugins: [
        {
          'middleware.before'() {
            option.before && option.before();
          },
          'middleware'() {
            const compiler = webpack(webpackConfig);
            this.set('compiler', compiler);
            compiler.plugin('done', stats => {
              if (stats.hasErrors()) {
                console.log(stats.toString({ colors: true }));
              }
            });
            return require('koa-webpack-dev-middleware')(compiler, Object.assign({
              publicPath: webpackConfig.output.publicPath,
              inline: true,
              quiet: true
            }, this.query));
          },
          'server.after'() {
            option.after && option.after();

            console.info('start debugger server at http://' + option.ip + ':' + option.port);
            console.info('\nThe websocket address for native is ws://' + option.ip + ':' + option.port + '/debugProxy/native');

            // open(`http://${option.ip}:8088/`);
            var udid = '';
            var srcUrl = "";
            this.app.use(function* (next) {
              if (this.url.indexOf('/envcheck/checkXcode') > -1) {
                this.body = yield envCheck.checkXcode();

              } else if (this.url.indexOf('/envcheck/checkIosSimulator') > -1) {
                this.body = yield envCheck.checkIosSimulator();

              } else if (this.url.indexOf('/envcheck/checkWeexToolkit') > -1) {
                this.body = yield envCheck.checkWeexToolkit();

              } else if (this.url.indexOf('/envCheck/checkQNapp') > -1) {
                this.body = yield envCheck.checkIosQN();

              } else if (this.url.indexOf('/launch/launchIosSimlator') > -1) {
                udid = this.query.udid;
                this.body = yield Launch.iosSimulator(this.query.udid);
              } else if (this.url.indexOf('/launch/installIosApp') > -1) {
                this.body = yield Launch.installIosApp(this.query.appName);
              } else if (this.url.indexOf('/launch/launchMdsDebug') > -1) {
                var result = spawn.sync('mds', ['weex', this.query.bundle], { stdio: 'inherit' });
                console.log(result)
              } else if (this.url.indexOf('/launch/bundle') > -1) {
                //dest/bundle.js地址代理到docs/xxx.js
                srcUrl = this.query.srcUrl;
                this.body = "success";

              }else if (this.url.indexOf('/dest/bundle.js') > -1) {
                console.log('dest',srcUrl);
                this.body = yield new Promise((resolve, reject) => {
                  request(srcUrl, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      resolve(body);
                    }
                    reject(error);
                  })
                })
              }
            });
          }
        }
      ],
    });
  })
}
