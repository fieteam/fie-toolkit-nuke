'use strict';
import {createElement, Component,render} from 'rax';
import {View, Text} from 'nuke';
import AddItem from '../mods/addItem.js';
import List from '../mods/list.js';
import {connect} from 'rax-redux';
import {modifyItem,addItem,initList} from '../redux/actions/todo'

class Todo extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      props.dispatch(initList());
    }
    modifyItem = (index) =>{
        this.props.dispatch(modifyItem(index))
    }
    addItem =(obj) =>{
        this.props.dispatch(addItem(obj));
    }
    render() {
        return (
          <View style={styles.container}>
            <AddItem addItem={this.addItem}></AddItem>
            <List dataSource={this.props.todoMVC} modifyItem={this.modifyItem}/>
          </View>
        );
    }
}

const styles = {
    container: {
        flex:1,
        width:750,
        paddingTop:20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
};


function mapStateToProps(state){
  return {
    todoMVC:state.todoReducer
  }
};
export default connect(mapStateToProps)(Todo);
