


// import DeviceInfo from 'react-native-device-info';

export default httpBaseConfig = {
    baseUrl: 'http://129.211.71.111:9002',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'deviceId': DeviceInfo.getUniqueID(),
        // 'version': DeviceInfo.getVersion(),
        // 'token': 'asdf',
    }
  }

//   http://129.211.71.111:9002/vocaBook/getVocaBooks