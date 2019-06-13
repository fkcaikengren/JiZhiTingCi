


// import DeviceInfo from 'react-native-device-info';

export default httpBaseConfig = {
    baseUrl: 'http://rap2api.taobao.org/app/mock/167294',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'deviceId': DeviceInfo.getUniqueID(),
        // 'version': DeviceInfo.getVersion(),
        'token': 'asdf',
    }
  }