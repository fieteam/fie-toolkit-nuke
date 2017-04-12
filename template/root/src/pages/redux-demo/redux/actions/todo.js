'use strict';
import { Http, NameSpace } from '$util/index';
const ns = NameSpace('TODO');
export const INIT_LIST = ns('INIT_LIST');
export const DELETE_ITEM = ns('DELETE_ITEM');
export const ADD_ITEM = ns('ADD_ITEM');
export const MODIFY_ITEM = ns('MODIFY_ITEM');

export function initList(param) {
  return dispatch => {
    Http.fetch({
      name: 'interface.page.init.get',
      data:{
        method:'GET',
        dataType: 'json'
      }
    }).then(initState => {
      return dispatch({type:INIT_LIST,initState})
    })
  }
}
export function deleteItem(id) {
  return { type: DELETE_ITEM, id };
}
export function addItem(obj) {
  return { type: ADD_ITEM, obj }
}
export function modifyItem(id) {
  return { type: MODIFY_ITEM, id }
}
