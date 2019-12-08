import axios from 'axios';
import httpBaseConfig from './httpBaseConfig';

export const createHttp = (config=httpBaseConfig)=>{
    const instance = axios.create(config);
    //请求拦截处理
    instance.interceptors.request.use(async config => {
        //添加token
        //显示加载



        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    //响应拦截处理
    instance.interceptors.response.use(async res => {
        //隐藏加载


        return res;
    }, function (error) {
        //统一处理错误


        return Promise.reject(error);
    });

    return instance
}