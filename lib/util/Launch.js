/*
 *  模拟器启动
 *  feature:
 *  1、启动模拟器
 *  2、启动具体应用
 */
const chalk = require('chalk');
const Promise = require('promise');
const semver = require('semver');
const which = require('which')
var spawn = require('cross-spawn');
var ioslib;
if (process.platform != 'win32') {
  ioslib = require('ioslib');
} else {
  ioslib = false;
}
module.exports.iosSimulator = function* (udid) {
  if (!ioslib) {
    resolve(false);
  }
  return new Promise((resolve, reject) => {
    ioslib.simulator.launch(udid, function (err, simHandle) {
      if (err) resolve(false)
      resolve(true);
    });
  })
}

module.exports.installIosApp = function* (appName) {
  if (appName == 'ios_qn') {
    console.log(`exec : fie simctl ios-qn latest`);
    spawn.sync('fie', ['simctl', 'ios-qn', 'latest']);
  } else {
    console.log(`exec : fie simctl ios-tb latest`);
    spawn.sync('fie', ['simctl', 'ios-tb', 'latest']);
  }
  return true;
};
