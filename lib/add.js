'use strict';
var fieInstance;
var toolUtil = require('./util');
var fs = require('fs');
var path = require('path');
var cwd = toolUtil.getCwd();
var inquirer = require('inquirer');
var walk = require('walk-fs');

module.exports = function* (fie, options) {
  var clientArgs = options.clientArgs;
  var type = clientArgs.type;
  var name = clientArgs.name;
  var pageTypeMap = {
    rp: 'redux-page',
    sp: 'simple-page'
  };
  var config = fie.getModuleConfig();
  fieInstance = fie;
  if (!config.addPath) {
    return fieInstance.logError('fie.config.js文件中不存在addPath配置项，请联系主题作者或自行添加');
  }

  if (!config.addPath[type]) {
    return fieInstance.logError(`未找到对应${type}的fie add 命令,请查看或修改fie.config.js中的addPath字段`);
  }

  return yield addTemplate(config.addPath, type, name)

};
// 根据你template文件夹获取添加任意内容
function* addTemplate(addPath, type, name) {
  //正则来源https://github.com/parshap/node-sanitize-filename
  var reg = /[\/\?<>\\:\*\|":]/g;
  var config = fieInstance.getModuleConfig();
  var allNames;
  var sstrReplaceData;
  var cwd = toolUtil.getCwd();
  var suffix = addPath[type].suffix ? addPath[type].suffix:undefined;
  if (!name) {
    const answers = yield inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入要添加的名称，多个单词请用-链接',
        default: function () {
          return 'new-template';
        }
      }
    ]);
    name = answers.name
  }
  if (reg.test(name)) {
    fieInstance.logError('页面名称不能带有特殊字符 (/, ?, <, >, \, :, *, |, and ")');
    process.exit(0);
  }
  if (!addPath[type].path) {
    fieInstance.logError('未定义拷贝的目标path');
  }
  if ( typeof suffix !== 'string' && fs.existsSync(path.resolve(cwd, addPath[type].path, name))) {
    fieInstance.logError('文件夹已存在');
    process.exit(0);
  }
  if(fs.existsSync(path.resolve(cwd, addPath[type].path, `${name}.${suffix}`))){
    fieInstance.logError('文件名已存在');
    process.exit(0);
  }
  fieInstance.logInfo('正在添加文件...');
  var sstrReplaceData =[{
    str:'development-template-name',
    replacer:name
  }]
  //如果template type下是文件夹则拷贝整个文件夹到dest，否则复制单个文件。
  walk(path.resolve(cwd,`template/${type}`),{recursive:false},function(srcPath,stat){
    if (stat.isDirectory()) {
      fieInstance.dirCopy({
        src: srcPath,
        dist: path.resolve(cwd, addPath[type].path,name),
        sstrReplace:sstrReplaceData,
        data:{name:name}
      });
    } else {
      fieInstance.fileCopy({
        src: srcPath,
        dist: path.resolve(toolUtil.getCwd(), addPath[type].path, `${name}.${suffix}`),
        data:{name:name}
      });
    }
    process.exit(0);
  },function(err){
    if(err){
     return fieInstance.logError(err);
    }
  })
}

