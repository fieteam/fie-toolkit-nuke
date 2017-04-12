'use strict';
import {createElement, Component,render} from 'rax';
import {View, Text, Modal,ListView,Checkbox,Switch} from 'nuke';

class List extends Component {
    constructor(props) {
      super(props);

      this.state = {};
    }
    renderHeader = () =>{
      return (
        <View style={styles.header}>
          <Text style={styles.header_content}>存在以下待办事件:</Text>
        </View>
      )
    }
    changeItemStatus =(index,e)=>{
        this.props.modifyItem(index);
    }
    renderItem = (item,index) => {
      return (
        <View style={styles.cellItem}>
          <Text style={styles.content}>{item.content}</Text>
          <View style={styles.bottom}>
              <Text style={styles.time}>截止时间:{item.time}</Text>
              <View style={styles.check}>
                <Switch onValueChange={this.changeItemStatus.bind(this,index)} checked={item.status}/>
              </View>
          </View>
        </View>
      )
    }
    render() {
        return (
            <ListView
               renderHeader={this.renderHeader}
               renderRow={this.renderItem}
               dataSource={this.props.dataSource}
               style={styles.listContainer}
             />
        );
    }
}

const styles = {
    listContainer: {
        flex:1,
        width:750
    },
    header:{
        width:750,
        borderBottomWidth:2,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:20,
        borderBottomColor:'#3089DC',
    },
    header_content:{
        fontSize:40,
        color:'#3089DC'
    },
    cellItem:{
        width:750,
        height:200,
        backgroundColor:'#ffffff',
        borderBottomWidth:2,
        borderBottomColor:'#3089DC',
    },
    content:{
        width:750,
        height:100,
        marginLeft:15,
        marginTop:10,
        color:'#3089DC'
    },
    bottom:{
        width:750,
        height:100,
        flexDirection:'row',
        alignItems:'center'
    },
    check:{
        flexDirection:'row',
        alignItems:'center',
        position:'absolute',
        right:10,
        bottom:20
    },
    time:{
        width:400,
        color:'#520520',
        fontSize:24,
        marginLeft:15
    }
};

export default List;
