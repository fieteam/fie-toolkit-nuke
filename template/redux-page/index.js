/** @jsx createElement */

'use strict';

import {createElement,render, Component} from 'rax';
import {View, Text} from 'nuke-components';
import {Provider} from 'nuke-redux';
import Container from './container';

import createStore from './store';
import reducers from './reducers';
const store = createStore(reducers);

class App extends Component {
  render() {
    return <View style={styles.container}>
      <Container />
    </View>;
  }
}

const styles = {
  container: {
    width: '750rem'
  },
  text: {
    textAlign: 'center',
    fontSize: '70rem'
  }
}

render(<Provider store={store}>
  <App />
</Provider>);
