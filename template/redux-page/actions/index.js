import {ajax} from '../../../util';
import makeActionCreator from '@alife/action-creater';

export const ADD_LIST = 'ADD_LIST';
export const addList = makeActionCreator(ADD_LIST, 'list');

export function getAsyncData(data) {
  return (dispatch) => {
    ajax({
        api: 'home'
      }, (res) => {
        dispatch(addList(res.data));
      }, (e) => {
        console.log(e);
      }
    );
  }

}