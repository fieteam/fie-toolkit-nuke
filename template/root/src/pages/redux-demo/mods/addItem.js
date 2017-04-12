'use strict';
import {createElement, Component,render} from 'rax';
import {View, Text,Modal,Button,Input} from 'nuke';


class AddItem extends Component {
    constructor(props) {
      super(props);

      this.state = {
          text:'',
          time:''
      };
    }
    changeInput = (content,e) => {
      this.setState({
          text:content.value
      })
    }
    changeTimeInput = (value,e) => {
      console.log(value);
      this.setState({
        time:value
      })
    }
    addItem = () => {
        if(this.state.text.length == 0){
            Modal.toast('事件为空');
        }else if(this.state.time == ''){
            Modal.toast('时间为空');
        }else{
            this.props.addItem({
                time:this.state.time,
                content:this.state.text,
                status:false
            });
        }
    }
    render() {
        return (
          <View style={styles.container}>
            <Input style={styles.input} placeholder="待办事件" onInput={this.changeInput}/>
            <View style={styles.container_inner}>
                <Input style={styles.timeInput} htmlType="date" placeholder="YYYY-MM-DD" onChange={this.changeTimeInput}/>
                <Button type="primary" style={styles.button} onPress={this.addItem}>增加待办</Button>
            </View>
          </View>
        );
    }
}

const styles = {
    container: {
        height:200,
        width:750,
        backgroundColor: '#F5FCFF',
        justifyContent:'flex-start',
        flexDirection:'column'
    },
    container_inner:{
      width:750,
      height:80,
      marginTop:10,
      flexDirection:'row'
    },
    timeInput:{
      width:400,
      height:80
    },
    input:{
        width:750,
        height:80
    },
    button:{
        position:'absolute',
        width:140,
        height:80,
        right:20,
    }
};

export default AddItem;
