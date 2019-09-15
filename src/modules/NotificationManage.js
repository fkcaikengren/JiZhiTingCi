import { NativeEventEmitter, NativeModules } from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.NotificationManage);

//监听关闭
NativeModules.NotificationManage.onClose = (fn)=>{
    eventEmitter.addListener('closeAction', (event) => {
        fn(event);
    });
}

//监听暂停
NativeModules.NotificationManage.onPause = (fn)=>{
    eventEmitter.addListener('pauseAction', (event) => {
        fn(event);
    });
}

//监听播放
NativeModules.NotificationManage.onPlay = (fn)=>{
    eventEmitter.addListener('playAction', (event) => {
        fn(event);
    });
}


export default NativeModules.NotificationManage;