var fs = require('fs-extra');
var path = require('path');
var getDirName = path.dirname;
var ejs = require('ejs')
var mkdirp = require('mkdirp');
var walk = require('walk');
var utils = require('./util/qap-utils');

var work_path = process.cwd();
var hasH5 = true;
const TEMPLATE_WEEX_HTML_PATH = path.join(__dirname, "./tpl/degrade.html"); //初始项目路

/**
 * 产生降级目录和文件，包含bundle js和相应的html
 */
function outputWe(outputDir) {
    //var webpackConfig = require(process.cwd() + '/webpack.config');
    var prodWebpackConfig = utils.getWebpackConfig().default;
    //拷贝bundle js
    var buildBundleDir = path.join(work_path, prodWebpackConfig.output.publicPath);
    fs.ensureDirSync(buildBundleDir);
    // fs.ensureDirSync(outputDir);
    fs.copySync(buildBundleDir, outputDir);
    //根据bundle js产生html

    var walker = walk.walk(buildBundleDir, { followLinks: false });

    walker.on("file", function(root, fileStats, next) {
        //qap.json
        // var jssdkJson = utils.getJSSDKJsonSync();
        var qapJsonPath = require(path.join(process.cwd(), 'qap.json'));
        //隐藏掉appkey
        qapJsonPath.appKey = "";
        //var qapStr = fs.readFileSync(qapJsonPath, "utf-8");
        var qapStr = "JSON.parse(decodeURIComponent('" + encodeURIComponent(JSON.stringify(qapJsonPath)) + "'))";
        if (fileStats.name.endsWith('.js')) {
            var htmlName = fileStats.name.substr(0, fileStats.name.length - 3) + '.html';
            copySingleFile(TEMPLATE_WEEX_HTML_PATH,
                path.join(outputDir, path.relative(buildBundleDir, root), htmlName), {
                    bundleJs: './' + fileStats.name,
                    jssdk: '',
                    qap_json: qapStr
                });
        }
        next();
    });

    walker.on("errors", function(root, nodeStatsArray, next) {
        next();
    });

    walker.on("end", function() {
        //console.log("all done");
    });
}

function copySingleFile(src, des, templates) {
    //var deferred = Q.defer();
    ejs.renderFile(src, templates, function(err, str) {
        writeFile(des, str, function(err) {
            if (err) {
                console.log(err);
            }
        });
    });
}

function writeFile(ppath, contents, cb) {
    //fs.writeFileSync(ppath, contents);
    mkdirp(getDirName(ppath), function(err) {
        if (err) {
            return cb(err);
        }
        fs.writeFileSync(ppath, contents);
    });
}

exports.outputWe = outputWe;