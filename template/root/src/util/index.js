import gw from './request/gw';
import fetch from './request/fetch';
import mtop from './request/mtop';

export default {
    Http: {
        gw: gw,
        fetch: fetch,
        mtop: mtop
    },
    NameSpace:(name)=>{
        return function(v) {
            return name + '-' + v;
        }
    }
}