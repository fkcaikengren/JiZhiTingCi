import axios from 'axios';
import httpBaseConfig from './httpBaseConfig';
import { store } from '../redux/store'
import { DURATION } from 'react-native-easy-toast'

const opt = {
    showLoader: true,
    handleError: true
}

const createHttp = (options = opt, config = httpBaseConfig) => {
    config.headers.Authorization = store.getState().mine.credential.accessToken
    const instance = axios.create(config);


    //请求拦截处理
    instance.interceptors.request.use(async config => {
        //显示加载
        if (options.showLoader) {
            store.getState().app.loader.show("加载中...", DURATION.FOREVER)
        }

        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    //响应拦截处理
    instance.interceptors.response.use(async res => {
        console.log(res.data)
        //隐藏加载
        if (options.showLoader) {
            store.getState().app.loader.close()
        }

        return res;
    }, function (error) {
        return Promise.reject(error);
    });

    return instance
}


export default createHttp