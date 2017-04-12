'use strict';
var fs = require('fs');
var path = require('path');
var open = require('open');
const webpack = require('webpack');
const dora = require('dora');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const spawn = require('cross-spawn');
const util = require('./util');
const rxServer = require('./rx-server');
const httpProxy = require('http-proxy');
const chalk = require('chalk');
const ip = util.getIp();

module.exports = function* (fie, options) {
  var sdkConfig = fie.getModuleConfig();
  sdkConfig.port = sdkConfig.port||8080;  //qap通过8080读取qap.json文件

  if (!fs.existsSync(path.resolve(process.cwd(), 'webpack.config.js'))) {
    fie.logError('未发现 webpack.config.js 文件, 可以使用 fie add conf 添加对应版本 webpack 配置文件');
    return;
  }

  process.env.DEV = 1;
  process.env.LIVELOAD = sdkConfig.liveload ? 1 : 0;
  
  let webpackConfig = require(path.resolve('webpack.config.js'));
  //代理build目录到根目录
  httpProxy.createProxyServer({target:`http://${ip}:${sdkConfig.port}/`}).listen(3000);

  rxServer(webpackConfig,{
    ip,
    port: sdkConfig.port,
    after:()=>{
      console.log(chalk.red.underline.bold(`👊  weex debugger: http://${ip}:8088`));
      console.log(chalk.blue.underline.bold(`✋ 调试辅助页面: http://${ip}:${sdkConfig.port}/build/run.html`));
      console.log(`To stop service, press [Ctrl + C] ..\n\n`);
      // setTimeout(function(){
      //   // open(`http://${ip}:${sdkConfig.port}/${sdkConfig.openTarget}`);
      //   open(`http://${ip}:${sdkConfig.port}/build/run.html`);
      // }, 1000);
    }
  });
  options.callback && options.callback();
}
