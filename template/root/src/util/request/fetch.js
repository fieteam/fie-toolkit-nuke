/**
 * https://g.alicdn.com/x-bridge/qap-sdk/1.0.10/book/api/api-fetch.html
 */
import QN from 'QAP-SDK';
import APIMAP from '../apimap';
import G from '../global.js';
import { wpo } from './retcode';

module.exports = function (param) {
    if (G.env && G.env == 'local') {
        try {
            let url = APIMAP.local[param.name].value;
            return QN.fetch(url).then(response => {
                return response.json();
            }).catch(err => {
                console.log(err);
            });
        } catch (error) {
            throw new Error(error, 'local url is undefined in apimap.js')
        }
    } else {
        let st = new Date();
        try {
            let url = APIMAP.product[param.name].value;
            param.data.timestamp = Date.now();
            let queryString = QN.uri.toQueryString(param.data);
            param.url = url + '?' + queryString;

            return QN.fetch(url,param).then(response => {
                let ed = Date.now() - st;
                wpo(url, true, ed, 'success');
                return response.json();
            }).catch(err => {
                let ed = Date.now() - st;
                wpo(url, false, ed, `error: ${err}`);
                console.log('fetch error >>>>>', err);
            });;
        } catch (error) {
            throw new Error(error, 'product url is undefined in apimap.js')
        }
    }
}