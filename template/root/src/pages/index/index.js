'use strict';
import { createElement, Component, render } from 'rax';
import { View, Text, Modal, Link, Env } from 'nuke';
import Label from '$components/label/';
import G from '$util/global';
import {Http} from '$util/index';
const { appInfo } = Env;

class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    欢迎使用fie-toolkit-nuke!
                </Text>
                <Text style={styles.instructions}>
                    编辑src目录下的文件，开始rax之旅吧，当前未使用任何主题
                </Text>
                {appInfo.appName === 'QN' ?
                    <Link href='qap://redux-demo.js'>
                        <Text style={styles.link}>千牛环境下可通过qap协议进行多页跳转</Text>
                    </Link>
                    : null
                }
                <Label>点我试试</Label>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        width: 750,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    link: {
        color: '#EB7E10'
    }
};

render(<Demo />);

export default Demo;
