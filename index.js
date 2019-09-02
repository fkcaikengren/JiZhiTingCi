

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


import StorybookUI from './storybook';
import {createStorage} from './src/common/storage';
import {createHttp} from './src/common/http'

const Realm = require('realm');
//设置全局变量和拷贝realm (注：这部分代码只在安装App时运行一次)
global.Storage = createStorage();
global.Http = createHttp()

AppRegistry.registerComponent(appName, () => App);





// 进入storybook
// export default StorybookUI;