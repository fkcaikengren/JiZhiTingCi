

import {AppRegistry} from 'react-native';
import codePush from "react-native-code-push";
import App from './App';
import {name as appName} from './app.json';


import StorybookUI from './storybook';
import {createStorage} from './src/common/storage';
import {createHttp} from './src/common/http'
import VocaPlayService from './src/features/vocabulary/service/VocaPlayService';

const Realm = require('realm');
//设置全局变量和拷贝realm (注：这部分代码只在安装App时运行一次)
global.Storage = createStorage();
global.Http = createHttp()


//用户在启动App时，CodePush自动检测更新
// AppRegistry.registerComponent(appName,  () => codePush(App));
AppRegistry.registerComponent(appName,  () => App);





// 进入storybook
// export default StorybookUI;