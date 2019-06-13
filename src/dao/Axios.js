import axios from 'axios';
import qs from 'querystring';
import httpBaseConfig from '../common/httpBaseConfig';




let instance = axios;


export default class Axios {
    constructor(props) {
        if (props && typeof props === 'object') {
            instance = axios.create(props);
        } else {
            instance = axios.create(httpBaseConfig);
        }
 
       //请求拦截处理
        instance.interceptors.request.use(function (config) {
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
 
    async get(url) {
        return this.get(url, null)
    }
 
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
 
    async post(url) {
        return this.post(url, null, true, true)
    }
 
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
                if (response.code !== 0){
                    if (showError) {
                        // global.toast.alertWithType('warn', '温馨提示',response.message);
                        alert('温馨提示, 0');
                    }
                }
                if (response.code === 10011) {
                    // console.log("response.code error : " + response.code + " " + response.message);
                    
                } else if (response.code === 10012 || response.code === 10013 || response.code === 10014 || response.code === 20004) {
                    // console.log("response.code error2 : " + response.code + " " + response.message);
                    
                }
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
 
    setPostHeader(key, value) {
        instance.defaults.headers.post[key] = value;
    }
}
