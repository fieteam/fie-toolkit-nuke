/** 
 *  千牛网关请求
 *  千牛容器中H5与weex都可走通用协议网关,无法使用fetch
 *  非容器内如chrome，需使用QN.fetch兼容
*/
import QN from 'QAP-SDK';
import APIMAP from '../apimap';
import G from '../global.js';
import { wpo } from './retcode';
import { Env } from 'nuke';
const { isQNWeex } = Env;
const isDaily = false    ///daily|test/.test(Location.host);
const isOnline = false   ///online=true/.test(Location.search);

/*千牛网关请求封装*/
const host = isDaily ? '//yungw.daily.taobao.net/gw/invoke/' : isOnline ? 'http://yungw.prepub.taobao.com/gw/invoke/' : 'http://yungw.taobao.com/gw/invoke/';
const loginUrl = isDaily ? 'http://login.daily.taobao.net' : 'https://login.taobao.com';
const clientSupport = isQNWeex;

/*H5请求，未经测试*/
function h5Request(method, param, succfunc, errfunc) {
    let st = Date.now();
    param.data.timestamp = Date.now();
    let queryString = QN.uri.toQueryString(param.data);
    param.url = host + param.api + '?' + queryString;
    return QN.fetch(param.url,param).then(res => {
        let at = Date.now() - st;
        if (res.errorResponse) {
            wpo(param.api, false, at, `error: [${res.errorResponse.code}] ${res.errorResponse.msg}`);
        } else {
            wpo(param.api, true, at, `success`);
        }
        return res.json()
    }).then(res => {
        succfunc && succfunc(res);
        return res;
    }).catch(err =>{

    });
}
/**
 * 请求通过native网关，已测试
 * native网关调用注意插件权限appkey，可通过客户端日志查看。
 */
function JDYGatewayService(method, param, succfunc, errfunc) {

    let st = Date.now();
    return QN.app.invoke({
        api: 'callGWInterface',
        query: {
            name: param.api,
            method: method,
            gwParams: param.data ? JSON.stringify(param.data) : '{}'
        }
    }).then(res => {
        let at = Date.now() - st;
        /*兼容旧版客户端*/
        res.success ? res = res.success : null;
        res.fail ? res = res.fail : null;
        res.data ? res = res.data : null;
        console.log(res);
        if (res.errorResponse) {
            wpo(param.api, false, at, `error: [${res.errorResponse.code}] ${res.errorResponse.msg}`);
        } else {
            succfunc && succfunc(res.response);
            wpo(param.api, true, at, `success`);
            return res.response;
        }
    }, error => {
        let at = Date.now() - st;
        let errorCode = error.errorCode ? error.errorCode : error.code;
        let errorMessage = error.errorMsg ? error.errorMsg : error.message;

        console.log(param.api, `error: [${errorCode}] ${errorMessage}`);
        // errfunc(error);
        wpo(param.api, false, at, `error: [${errorCode}] ${errorMessage}`);
        return error;
    })
}

function _req(param, succfunc, errfunc) {
    if(G.env){
        param.api = APIMAP[G.env][param.name].value;
    }else{
        throw new Error('invalid G environment set,check global.js');
    }
    if (G.env && G.env == 'local') {
        let url = APIMAP.local[param.name].value;
        return QN.fetch(url).then(response => {
            return response.json();
        }).catch(err => {
            console.log(err);
        });
    } else {
        if (clientSupport) {
            return JDYGatewayService(APIMAP.product[param.name].method, param, succfunc, errfunc)
        } else {
            return h5Request(APIMAP.product[param.name].method, param, succfunc, errfunc)
        }
    }
}

export default _req;
