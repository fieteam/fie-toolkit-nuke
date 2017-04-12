import QN from 'QAP-SDK';
import APIMAP from '../apimap';
import G from '../global.js';

/**
 *  [mtop parmas obj]
 *  {
 *   api:     请求的 API 名称      [string]
 *   v:       API 版本号           [string]
 *   data:    请求的参数            [obj optional]
 *   appkey:  H5请求的 appkey      [string optional]
 *   ecode:   是否使用 ecode 签名    [number]
 *   type:    请求类型
 *   ...  https://g.alicdn.com/x-bridge/qap-sdk/1.0.10/book/api/api-mtop.html
 *   success,fail成功和失败的回调
 *  }
 */

module.exports = function(params){
    if(G.env && G.env == 'local'){
        let url = APIMAP.local[params.name].value;
        if(typeof url == 'undefined'){
            throw new Error('local url is undefined in apimap.js');
        }else{
            return QN.fetch(url);
        }
    }else{
        params.api = APIMAP.product[params.name].value;
        return QN.mtop({
            api:params.api,
            ...params.data
        });
    }
}