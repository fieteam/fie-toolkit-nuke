var inquirer = require('inquirer');
var Core0 = require('@ali/0-client-core');
var core = new Core0();
var request = require('request');
var themeUrl = 'http://dip.alibaba-inc.com/api/v2/services/schema/mock/56518?real';//主题列表接口
/**
 * cwd 安装路径
 * params 初始化参数
 */
module.exports.getThemeInstall = function*(cwd,params) {
    
    const themeSource = yield new Promise(function (resolve) {
        request(themeUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body).value)
            } else {
                reject(error);
            }
        });
    });
    
    const theme = yield inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: '请选择初始化主题',
        choices: themeSource.map((item) => {
            item.name = `${item.name}---${item.desc}`;
            item.value = item.url
            return item;
        })
    }]);

    yield core.useAliGitlabSeed({
        gitPath: theme.type,
        outputPath: cwd,
        params: params
    }).then(function (cb) {
        console.log(`${theme.type}主题安装成功`);
    }).catch(function (error) {
        console.log('拉取远程主题失败，请确认目标仓库public可读');
    });
}
