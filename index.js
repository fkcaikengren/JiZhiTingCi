import React from 'react';
import { Platform, StyleSheet, AppRegistry, Text, TextInput } from 'react-native';
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


const defaultFontFamily = {
    ...Platform.select({
        android: { fontFamily: 'Roboto' }
    })
};
// 解决文字粗体后显示不全
const oldRender = Text.render;
Text.render = function (...args) {
    const origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, {
        style: [defaultFontFamily, origin.props.style]
    });
};


//字体不随系统字体变化
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, { allowFontScaling: false })
Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false })


AppRegistry.registerComponent(appName, () => App);

