import { createAppContainer, createStackNavigator } from 'react-navigation';

import Home from './Home';

const MainNavi = createStackNavigator({
  Home,
});

export default createAppContainer(MainNavi);
