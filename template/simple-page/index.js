/** @jsx createElement */

'use strict';

import {createElement, render,  Component} from 'rax';
import {View, Text} from 'nuke';
import {Provider} from 'rax-redux';
import styles from './index.scss';

class App extends Component {
  render() {
    return <View style={styles.container}>
      <Text>simple page</Text>
    </View>;
  }
}

render(<Provider>
  <App />
</Provider>);
