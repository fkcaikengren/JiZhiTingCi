import axios from 'axios';
import httpBaseConfig from './httpBaseConfig';
import { store } from '../redux/store'
import { CircleLoader } from '../component/Loader'
import { DURATION } from 'react-native-easy-toast'

export const createHttp = (config = httpBaseConfig) => {
    const instance = axios.create(config);
    //请求拦截处理
    instance.interceptors.request.use(async config => {
        //添加token
        //显示加载
        store.getState().app.toast.show(CircleLoader, DURATION.FOREVER)

        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    //响应拦截处理
    instance.interceptors.response.use(async res => {
        //隐藏加载
        store.getState().app.toast.close()

        return res;
    }, function (error) {
        return Promise.reject(error);
    });

    return instance
}