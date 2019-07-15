import axios from 'axios';
import qs from 'querystring';
import httpBaseConfig from './httpBaseConfig';
import UserDao from '../features/mine/dao/UserDao'



let instance = axios;


export default class Axios {
    constructor(props) {
        if (props && typeof props === 'object') {
            console.log('初始化Axios:')
            console.log({...httpBaseConfig, ...props})
            instance = axios.create({...httpBaseConfig, ...props});
        } else {
            instance = axios.create(httpBaseConfig);
        }
 
       //请求拦截处理
        instance.interceptors.request.use(function (config) {
            console.log('config:')
            console.log(config)
            // 在发送请求之前做些什么
            return config;
        }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });

        //返回拦截处理
        instance.interceptors.response.use(function (response) {
            // 对响应数据做点什么
            return response;
        }, function (error) {
            // 对响应错误做点什么
            return Promise.reject(error);
        });

    }
 
    getUrl() {
        return httpBaseConfig.baseUrl;
    }
 
    //发送无参数的GET请求
    async get(url) {
        return this.get(url, null)
    }
    //发送带参数的GET请求
    async get(url, params) {
        try {
            // LoadingUtil.showLoadingDelay(500);
            let query = await qs.stringify(params);
            let response = null;
            // console.log(baseUrl + url, params)
            if (!params) {
                console.log("get :"+this.getUrl() + url)
                response = await instance.get(this.getUrl() + url);
            } else {
                console.log("get :"+this.getUrl() + url + '?' + query)
                response = await instance.get(this.getUrl() + url + '?' + query);
            }
            // LoadingUtil.dismissLoading();
            return response
        } catch (e) {
            // LoadingUtil.dismissLoading();
            console.log(e);
            return null
        }
    }
 
    //发送无参数的POST请求
    async post(url) {
        return this.post(url, null, true, true)
    }
 
    //发送带参数的POST请求
    async post(url, params, showLoading = true, showError = true) {
        try {
            if (showLoading) {
                // LoadingUtil.showLoadingDelay(500);
            }
            console.log("Post : "+this.getUrl() + url);
            let response = await instance.post(this.getUrl() + url, params);
            // if (showLoading) {
                // LoadingUtil.dismissLoading();
            // }
            // console.log(baseUrl + url, params)
  
            if (response) {  
                if (response.status != 200){
                    if (showError) {
                        alert('response.status: '+response.status);
                    }
                }
                console.log('response')
                console.log(response)
                
            }
            return response;
        } catch (e) {
            if (showLoading) {
                // LoadingUtil.dismissLoading();
            }
            console.log(e);
            return null
        }
    }
 
    //设置请求头
    setPostHeader(key, value) {
        instance.defaults.headers.post[key] = value
    }

    //设置Get请求头
    setGetHeader(key, value) {
        instance.defaults.headers.get[key] = value
    }
    
}
