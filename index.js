

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


// 保证release时，移除所有Console
if (!__DEV__) {
    global.console = {
        info: () => {},
        log: () => {},
        warn: () => {},
        debug: () => {},
        error: () => {}
    };
}


//用户在启动App时，CodePush自动检测更新
// AppRegistry.registerComponent(appName,  () => codePush(App));
AppRegistry.registerComponent(appName,  () => App);



// 进入storybook
// export default StorybookUI;