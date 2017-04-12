'use strict';
var toolUtil = require('./util');
var fs = require('fs');
var fs_extra = require('fs-extra');
var path = require('path');
var spawn = require('cross-spawn');
var inquirer = require('inquirer');
var chalk = require('chalk');
var which = require('which');
var themeUtil =require('./util/theme');

module.exports = function*(fie) {
  var cwd = toolUtil.getCwd();
  var projectName = cwd.split(path.sep).pop();
  var generateNames = toolUtil.generateNames(projectName);
  var config = fie.getModuleConfig();
  const answers = yield inquirer.prompt([
    {
      type: 'input',
      name: 'group',
      message: '当前项目所在的group',
      default: function() {
        return 'sui-project';
      }
    }
  ]);

  const repo = yield inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: '当前的项目类型',
      choices: [{
        name: '[手淘、天猫]rax集成开发环境',
        value: 'normal'
      }, {
        name: '[千牛]qap插件开发环境',
        value: 'qap'
      }]
    }
  ]);
  //执行命令 后面 带上 --debug  才能看到的调试信息
  //如 执行 fie init olympics --debug
  fie.logDebug(Object.assign({}, config, generateNames, {
    group: answers.group
  }));
  // copy root 目录到 项目中
  // 初始化的内容只包括src目录和package.json文件
  fie.dirCopy({
    src: toolUtil.getTemplateDir('root'),
    dist: cwd,
    data: Object.assign({}, config, generateNames, {
      group: answers.group,
      //兼容一下老版本
      projectName: projectName
    }),
    ignore: [
        'node_modules', 'build', '.DS_Store', '.idea'
      ],
    sstrRpelace: [
      {
        str: 'developing-project-name',
        replacer: projectName
        }
      ],
    filenameTransformer: function(name) {
      if (name === '_gitignore') {
        name = '.gitignore';
      }
      return name;
    }
  });

  if (repo.type == 'qap') {
    fs_extra.copy(toolUtil.getTemplateDir('qap.json'), path.resolve(cwd,
      'qap.json'), function(err) {
      if (err) console.log(err);
      console.log('qap.json注入成功');
    })
  } 
  /**
   *  远程主题覆盖本地基本配置 
   */
   yield themeUtil.getThemeInstall(cwd,{
     projectName:projectName,
     group:answers.group
   })

  //判断是否有.git,没有的话 则初始化一下
  if (!fs.existsSync(path.join(cwd, '.git'))) {
    fie.logInfo('正在对接 gitlab 仓库 ... ');
    spawn.sync('git', ['init']);
    spawn.sync('git', [
      'remote', 'add', 'origin', 'git@gitlab.alibaba-inc.com:' + answers.group +
      '/' + generateNames.fileName + '.git'
    ]);
    //初始化后提交一把
    spawn.sync('git', ['add', '*']);
    spawn.sync('git', ['commit', '-m', 'init project']);
  }
  //安装依赖
  fie.logInfo('开始安装 dependencies 依赖包 ... ');
  // 先装package里面的依赖
  yield fie.tnpmInstall();
  // 再装 nuke 主要是为了初始化的时候使用最新版本
  yield fie.tnpmInstall({
    name: 'nuke',
    save: true
  });
  console.log(chalk.yellow(
    '\n--------------------初始化成功,请按下面提示进行操作--------------------\n'));
  console.log(chalk.green(chalk.yellow('$ fie start') +
    '               # 可一键开启项目开发环境'));
  console.log(chalk.green(chalk.yellow('$ fie git create') +
    '          # 可自动在gitlab上创建仓库'));
  console.log(chalk.green(chalk.yellow('$ fie retcode create -p') +
    '   # 将项目接入retcode监控平台'));
  console.log(chalk.green(chalk.yellow('$ fie help') +
    '                # 可查看当前套件的详细帮助'));
  console.log(chalk.green('\n建议将现有初始化的代码提交一次到master分支, 方便后续切换到 ' + chalk.yellow(
    'daily/x.y.z') + ' 分支进行开发'));
  console.log(chalk.yellow(
    '\n--------------------技术支持:  @督布 --------------------\n'));
};
