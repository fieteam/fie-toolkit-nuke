import { combineReducers } from 'redux';
import * as actions from '../actions';
const InitState = {
  loading: false,
  data: {}
};


function index(state = InitState, action = {}) {
  switch (action.type) {

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  index
});

export default rootReducer;
