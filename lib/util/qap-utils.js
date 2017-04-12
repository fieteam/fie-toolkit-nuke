var path = require('path');
var child_process = require('child_process');
var fs = require('fs-extra');
var tcpPortUsed = require('tcp-port-used');
const http_request = require("request");
var findParentDir = require('find-parent-dir');

function printUsage() {}

function getWebpackConfig() {
    var webpackconfig = require(path.join(process.cwd(), 'webpack.config.js'));
    var projectPackagejson = require(path.join(process.cwd(), 'package.json'));
    var devIndex = projectPackagejson.qapConfig !== undefined &&
        projectPackagejson.qapConfig.webpack !== undefined &&
        projectPackagejson.qapConfig.devIndex !== undefined ?
        projectPackagejson.qapConfig.devIndex : 0;
    var prodIndex = projectPackagejson.qapConfig !== undefined &&
        projectPackagejson.qapConfig.webpack !== undefined &&
        projectPackagejson.qapConfig.prodIndex !== undefined ?
        projectPackagejson.qapConfig.prodIndex : 1;
    return {
        dev: webpackconfig.dev !== undefined ? webpackconfig.dev() : webpackconfig[devIndex],
        prod: webpackconfig.prod !== undefined ? webpackconfig.prod() : webpackconfig[prodIndex],
        default:webpackconfig
    }
}

function getRemoteJsContent(url) {
    return new Promise(function(resolve) {
        console.log('请求：' + url)
        http_request(url, function(urlerror, urlresponse, urlbody) {
            if (!urlerror && urlresponse.statusCode == 200) {
                resolve(urlbody)
            } else {
                reject(urlerror);
            }
        });
    });
}

function checkIsRootPath() {
    return new Promise(function(resolve, reject) {

        if (!fs.existsSync(path.join(process.cwd(), '/webpack.config.js'))) {
            reject('请在QAP工程根目录下运行该命令');
            // console.log('请在QAP工程根目录下运行该命令');
            //console.log('path:' + process.cwd());
            // try {

            //     findParentDir(process.cwd(), 'Manifest.xml', function(err, dir) {
            //         if (err) {
            //             reject(err)
            //         } else {
            //             resolve(dir)
            //         }
            //     })
            // } catch (err) {
            //     console.error('error', err);
            //     reject(err)
            // }
        } else {
            resolve(process.cwd());
        }
    });
}
/**
 * 如果
 * @param rn_path 
 */
function npm_install_if_need(projectRoot) {
    if (!fs.existsSync(path.join(process.cwd(), projectRoot, 'node_modules'))) {
        var cmd = 'npm';
        if (process.platform === 'win32') {
            cmd = 'npm.cmd';
        }
        console.log("正在安装依赖(\'npm install\')...");
        child_process.spawnSync(cmd, ['--registry=https://registry.npm.taobao.org', 'install'], { cwd: path.join(process.cwd(), projectRoot), stdio: [0, 1, 2] });
        // child_process.spawnSync(cmd, [path.resolve(__filename, '../../../node_modules/cnpm/bin/cnpm'), 'install'], 
        //     { cwd: path.join(process.cwd(), projectRoot), stdio: [0, 1, 2] });
    }
}

function checkPortIsFreeSync() {
    var resultArray = [];
    var devWebpackConfig = getWebpackConfig().dev;
    var needChecked = [parseInt(devWebpackConfig.port), 8080, 8088];
    // var server_port = utils.getListPort();
    // server_port.forEach(function(item) {
    //     needChecked.push(parseInt(item));
    // });

    var itemPromise = new Promise(function(resolve) {
        var portCount = 0;
        needChecked.forEach(function(item, idx, array) {
            tcpPortUsed.check(item, '127.0.0.1')
                .then(function(inUse) {
                    if (!inUse) {
                        //console.log("检查端口(" + item + ")：未占用");
                    } else {
                        //printPortUsed(item, null);
                        console.log(('检查端口(' + item + ')：被占用').red);
                        resultArray.push(item);
                    }
                    portCount++;
                    if (portCount == array.length) resolve(resultArray);
                }, function(err) {
                    //printPortUsed(item, err);
                    console.log(('检查端口(' + item + ')：' + err).red);
                    resultArray.push(item);
                    portCount++;
                    if (portCount == array.length) resolve(resultArray);
                });
        });
    });

    return itemPromise;
}

function checkAndroidDevices() {
    return new Promise(function(resolve, reject) {
        child_process.exec('adb devices -l',
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject(error)
                    return;
                } else {
                    console.log(stdout.split('\n'));
                    var devicesOutSplit = stdout.split('\n');
                    if (devicesOutSplit !== undefined && devicesOutSplit.length > 1) {
                        devicesOutSplit.map(function(item, index, array) {
                            console.log(item)
                        })
                    }
                }
            });
    });
}

function getJSSDKJson() {
    return new Promise(function(resolve, reject) {
        try {
            var sdkJson = require(path.join(process.cwd(), '.jssdk.json'));
            resolve(sdkJson);
        } catch (ex) {
            reject(ex);
        }
    });
}

function getJSSDKJsonSync() {
    var jsonResult = undefined;
    try {
        jsonResult = require(path.join(process.cwd(), '.jssdk.json'));
    } catch (ex) {
        console.log(ex);
    }
    return jsonResult;
}
function downloadZip(zipUrl, destZipFolder, originFolderName, folderName) {
    return new Promise(function(resolve, reject) {
        try {
            fs.ensureDirSync(destZipFolder);

            var destZipPath = path.join(destZipFolder, '.' + originFolderName + '.zip');
            //console.log('zipUrl:' + zipUrl);
            http_request(zipUrl)
                .pipe(fs.createWriteStream(destZipPath))
                .on('close', function() {
                    startUnzipSample(destZipPath, destZipFolder, function() {
                        //删除下载的zip文件
                        fs.removeSync(destZipPath);
                        fs.rename(path.join(destZipFolder, originFolderName), folderName, function(err){
                            if(err){
                                console.log(err);
                                reject(err);
                            }else{
                                resolve('ok');
                            }
                        })
                    });
                });
        } catch (exce) {
            reject(exce);
        }

    });

}
function startUnzipSample(zipFile, destFolder, cb) {
    var cp = require('child_process');
    var child = cp.fork(path.join(__dirname, 'unzip.js'), [destFolder, zipFile], {
        stdio: [0, 1, 2, 'ipc'],
        cwd: process.cwd(),
        env: process.env
    });

    child.on('message', function(m) {
        //console.log('received: ' + m);
    });
    child.on('error', function(err) {
        console.log(err)
    });
    child.on('exit', function(code, signal) {
        cb();
    });
}

exports.downloadZip = downloadZip;
exports.getJSSDKJsonSync = getJSSDKJsonSync;
exports.getJSSDKJson = getJSSDKJson;
exports.npmInstallIfNeeded = npm_install_if_need;
exports.checkPortIsFreeSync = checkPortIsFreeSync;
exports.checkIsRootPath = checkIsRootPath;
exports.getRemoteJsContent = getRemoteJsContent;
exports.getWebpackConfig = getWebpackConfig;
exports.checkAndroidDevices = checkAndroidDevices;