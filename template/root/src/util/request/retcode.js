import __WPO from '@ali/retcodelog';
function wpo(...args) {
  __WPO.retCode.apply(__WPO, args);
}
export default {
    wpo:wpo
}
