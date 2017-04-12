'use strict';
import { createElement, Component, render } from 'rax';
import { View, Text, Modal } from 'nuke';
import { Provider } from 'rax-redux';
import reducers from './redux/reducers/index.js';
import createStore from './redux/store/index.js'
import Todo from './container/todo.js';
import QN from 'QAP-SDK';
const store = createStore(reducers);
class ReduxPage extends Component {
    componentDidMount() {
        QN.navigator.setTitle({
            query: {
                title: '待办列表'
            },
            success(result) {
                console.log(result);
            },
            error(error) {
                console.log(error);
            }
        })
    }
    render() {
        return (
            <Provider store={store}>
                <Todo></Todo>
            </Provider>
        );
    }
}
render(<ReduxPage />);
export default ReduxPage;
