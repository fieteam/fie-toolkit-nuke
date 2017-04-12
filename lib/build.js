'use strict';


var fs = require('fs');
var path = require('path');
var spawn = require('cross-spawn');
var archiver = require('archiver');
var zipQap = require('./qap-package.js');
var envCheck = require('./util/EnvCheck.js');
var degrade = require('./degrade');
module.exports = function(fie, options) {
  var cli,repoName;
  if (!fs.existsSync(path.resolve(process.cwd(), 'webpack.config.js'))) {
    fie.logError('未发现 webpack.config.js 文件, 可以使用 fie add conf 添加对应版本 webpack 配置文件');
    return;
  }
  var pkg = fs.readFileSync(path.resolve(process.cwd(),'package.json'),'utf8');
  repoName = JSON.parse(pkg).name;
  fie.logInfo('项目打包中...');
  cli = spawn('./node_modules/.bin/webpack', [
    '--config',
    './webpack.config.js'
  ], {stdio: 'inherit'});

  cli.on('close', function(status) {
    if (status == 0) {
      fie.logSuccess('打包完成');
      if(envCheck.qap()){
        let webpackConfig = require(path.resolve('webpack.config.js'));
        let build_path = path.join(process.cwd(),webpackConfig.output.publicPath);
        let output_path = path.resolve(process.cwd(),`_output/`);
        let output_zip_path = path.join(output_path,`${repoName}.zip`);
        zipQap(build_path,output_zip_path);
        degrade.outputWe(path.join(output_path, 'qap/'));
        //打qap html降级页面
      }
      options.callback && options.callback();
    } else {
      fie.logError('打包失败', status);
    }
  });

};
