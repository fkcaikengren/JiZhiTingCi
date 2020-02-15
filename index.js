
import { Platform, AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';




//android 开启动画
// if(Platform.OS === "android" ){
//     UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// 保证release时，移除所有Console
if (!__DEV__) {
    global.console = {
        info: () => { },
        log: () => { },
        warn: () => { },
        debug: () => { },
        error: () => { }
    };
}


AppRegistry.registerComponent(appName, () => App);

