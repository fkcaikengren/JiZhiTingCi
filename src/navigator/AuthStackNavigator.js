import { createStackNavigator } from 'react-navigation';

import LoginPage from '../page/LoginPage';

export default createStackNavigator({
    Login:LoginPage,
},{
    initialRouteName: 'Login',
    headerMode:'none',
});