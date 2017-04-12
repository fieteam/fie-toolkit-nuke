/**
 * @author 擎空 <zhenwu.czw@alibaba-inc.com>
 */
'use strict';

var path = require('path');
var fs = require('fs');
var spawn = require('cross-spawn');
var toolUtil = require('./util');
var cwd = toolUtil.getCwd();
var inquirer = require('inquirer');
/**
 * 获取当前分支
 * @returns {string}
 */
function getCurBranch() {
  var headerFile = path.join(cwd, '.git/HEAD');
  var gitVersion = fs.existsSync(headerFile) && fs.readFileSync(headerFile, { encoding: 'utf8' }) || '';
  var arr = gitVersion.split(/refs[\\\/]heads[\\\/]/g);
  var v = arr && arr[1] || '';
  return v.trim();
}


module.exports = function *(fie, options) {

  var clientArgs = options.clientArgs;
  var type = clientArgs.shift() || 'd';
  var branch = getCurBranch();
  var userHome = process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH; //兼容windows
  var AWP_CONFIG_FILE_PATH = userHome + '/.awp.json';
  var awpConfig = {};
  try {
    awpConfig = require(AWP_CONFIG_FILE_PATH);
    var repoConfig = require(path.resolve('./fie.config.js'));
    if (!repoConfig.awp) {
      const initAwp = yield inquirer.prompt([
        {
          type: 'input',
          name: 'dailyAppID',
          message: '请输入你的应用日常ID'
        }, {
          type: 'input',
          name: 'onlineAppID',
          message: '请输入你的应用线上ID'
        }, {
          type: 'input',
          name: 'zipDir',
          message: '请输入你的本地应用zip包地址'
        }
      ]);
      fie.setModuleConfig('awp', {
        awpPackage: {
          dailyAppID: initAwp.dailyAppID,
          onlineAppID: initAwp.onlineAppID,
          zipDir: initAwp.zipDir
        }
      })
    }

  } catch (e) {
    fie.logWarn('第一次使用fie-awp？先使用fie awp config生成基本配置吧');
    process.exit(0);
  }

  if (branch === 'master') {
    fie.logWarn('不建议在master分支上进行开发及发布,建议切换到 daily/x.y.z 分支进行开发');
  }


  // 发布到daily环境
  if (type === 'd' || type === 'daily') {
    fie.logInfo('开始提交到daily环境,大概需要几秒的时间,请稍等...');

    fie.getFieModule('fie-plugin-awp', function (err, awp) {
      awp(fie, {
        clientArgs: ['daily'],
        callback: function () {
          fie.logSuccess('日常发布成功,所有操作完成!');
          options.callback && options.callback();
        }
      });
    });
    return;
  }

  fie.logInfo('开始进行项目发布,大概需要几十秒的时间,请稍等...');
  fie.getFieModule('fie-plugin-awp', function (err, awp) {
    awp(fie, {
      clientArgs: ['publish'],
      callback: function () {
        fie.logSuccess('线上发布成功,所有操作完成!');
        options.callback && options.callback();
      }
    });
  });
};
