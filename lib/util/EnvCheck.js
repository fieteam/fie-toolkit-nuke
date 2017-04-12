/*
 *  模拟器检测及配置
 *  feature:
 *      1、ios&&android模拟器应用安装指引
 *      2、千牛&&手淘应用安装 [mds]
 *      3、启动应用或到调试页面
 *      4、mds?
 */
const chalk = require('chalk');
const Promise = require('promise');
const semver = require('semver');
const which = require('which');
const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');
var ioslib;
if (process.platform != 'win32') {
  ioslib = require('ioslib');
} else {
  ioslib = false;
}
/**
 * 检测weex-toolkit
 * @method function
 * @return promise
 */

module.exports.checkWeexToolkit = function () {
  return new Promise((resolve, reject) => {
    which('weex', function (err, resolvePath) {
      if (err) resolve(false);
      resolve(true);
    })
  })
}

/**
 * [检测xcode安装信息]
 * @method function
 * @return promise
 */

module.exports.checkXcode = function () {
  return new Promise((resolve, reject) => {
    if (!ioslib) {
      resolve(false);
      return;
    }
    ioslib.xcode.detect(function (err, xcodeInfo) {
      if (err || !xcodeInfo.selectedXcode) {
        resolve(false);
        return;
      }
      if (xcodeInfo.selectedXcode.version && xcodeInfo.selectedXcode.version.split('.').length < 3) {
        xcodeInfo.selectedXcode.version = xcodeInfo.selectedXcode.version + '.0';
      }
      if (semver.valid(xcodeInfo.selectedXcode.version)) {
        if (semver.lt(xcodeInfo.selectedXcode.version, '7.0.0')) {
          resolve(false);
        }
        else {
          resolve(true);
        }
      } else {
        console.log(chalk.red(`${xcodeInfo.selectedXcode.version}不是有效的xcode版本`));
        process.exit(-1);
      }
    });
  })
}
/**
 * [检测模拟器安装信息]
 * @method function
 * @return promise
 */

module.exports.checkIosSimulator = function () {
  return new Promise((resolve, reject) => {
    var simulatorList = [];
    if (!ioslib) {
      resolve(false);
      return;
    }
    ioslib.simulator.detect(null, function (err, simInfo) {
      if (simInfo.simulators && simInfo.simulators.ios && Object.keys(simInfo.simulators.ios).length > 0) {
        for (var sys in simInfo.simulators.ios) {
          for (var simulator of simInfo.simulators.ios[sys]) {
            if (simulator.deviceName.indexOf('iPhone') > -1)
              simulatorList.push({
                name: `${simulator.version}--${simulator.name}--${simulator.deviceName}`,
                value: simulator.udid
              });
          }
        }
        resolve(simulatorList);
      }
    });
  })
}
/**
 * 检测是否已经安装了mds
 * @method function
 * @return {[type]} [description]
 */
module.exports.mds = function () {
  var mds = spawn.sync('which', ['mds']);
  if (mds.status == 1)
    return false;
  else {
    return true;
  }

}
/*
 * 判断模拟器是否安装，直接mds调试
 */
module.exports.checkIosTB = function () {
  return false;
}
/*
 * 判断千牛模拟器是否存在
 */
module.exports.checkIosQN = function () {
  return false;
}
/**
 * 是否是qap应用
 */
module.exports.qap = function () {
  var qap = false;
  if (fs.existsSync(path.resolve(process.cwd(), 'qap.json'))) {
    qap = true;
  }
  return qap;
}
