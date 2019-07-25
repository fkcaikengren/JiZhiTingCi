

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
//
// global.Symbol = require('core-js/es6/symbol');
// require('core-js/fn/symbol/iterator');
// require('core-js/fn/map');
// require('core-js/fn/set');
// require('core-js/fn/array/find');
const Realm = require('realm');
Realm.copyBundledRealmFiles();
console.log('copy voca.realm');

AppRegistry.registerComponent(appName, () => App);



// import StorybookUI from './storybook';
// export default StorybookUI;