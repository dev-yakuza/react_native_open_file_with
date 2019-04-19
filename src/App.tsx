import * as React from 'react';
import { Root } from 'native-base';

import Navigator from './Screen/Navigator';

interface Props {}
interface State {}

export default class App extends React.Component<Props, State> {
  render() {
    return (
      <Root>
        <Navigator />
      </Root>
    );
  }
}
