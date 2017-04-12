/* @jsx createElement */
import { createElement, render, Component } from 'rax';
import { Text, View, TouchableHighlight } from 'nuke';
import { bindActionCreators , connect} from 'rax-redux';
import * as actions from '../actions';

import { Button } from 'nuke';

// 参数传入
export class Container extends Component {
  constructor(props) {
    super(props);
  }

  handleGetData(type) {
    const {dispatch} = this.props;

    dispatch(actions.getAsyncData(type))
  }

  render() {
    const props = this.props.data;

    return <View>
      <Text>Hello</Text>
      <Text>店掌柜Rx开发脚手架</Text>
      <Button>测试</Button>
    </View>
  }
}

function mapStateToProps(state) {
  return { data: state.index };
}
export default connect(mapStateToProps)(Container);
