/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
const Realm = require('realm');
// Realm.copyBundledRealmFiles();
// console.log('copy voca.realm');

AppRegistry.registerComponent(appName, () => App);
