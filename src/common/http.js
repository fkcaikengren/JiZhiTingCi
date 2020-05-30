import axios from 'axios';
import httpBaseConfig from './httpBaseConfig';
import { store } from '../redux/store'
import { DURATION } from 'react-native-easy-toast'
import { MODIFY_CREDENTIAL } from '../features/mine/redux/action/mineAction';
import { logoutHandle } from '../features/mine/common/userHandler';


const opt = {
    showLoader: false,
    showLoaderText: "加载中",
}

/**
 * @function 创建一个请求对象
 * @param  config 请求配置，为null时，则使用默认配置
 * @param  options 选项
 */
const createHttp = (config, options = null) => {
    if (options) {
        options = { ...opt, ...options }
    } else {
        options = opt
    }
    config = config ? config : httpBaseConfig
    config.headers.Authorization = store.getState().mine.credential.accessToken
    const instance = axios.create(config);

    //请求拦截处理
    instance.interceptors.request.use(async config => {
        //显示加载
        if (options.showLoader) {
            store.getState().app.loader.show(options.showLoaderText, DURATION.FOREVER)
        }
        //判断是否过期  //存在Bug:同时发送请求会导致同时多次刷新token
        const { accessToken, refreshToken, expiresIn } = store.getState().mine.credential
        let authorization = accessToken
        if (accessToken && expiresIn && Date.now() >= expiresIn) { //过期
            const tokenHttp = axios.create(httpBaseConfig);
            const tokenRes = await tokenHttp.post("/refreshToken", { refreshToken })
            if (tokenRes.status === 200) {
                console.log("--------------刷新token成功------------------")
                const credential = tokenRes.data
                authorization = credential.accessToken
                // 修改redux
                store.dispatch({ type: MODIFY_CREDENTIAL, payload: { credential } })
            }
            // 不用try catch处理，拦截器内部处理刷新失败抛出的Error
        }

        // 修改请求的Authorization
        config.headers.Authorization = authorization
        return config;
    }, function (error) {
        // 隐藏加载
        if (options.showLoader) {
            store.getState().app.loader.close()
        }
        store.getState().app.toast.show("请求失败", 2000)
        return Promise.reject(error);
    });

    //响应拦截处理
    instance.interceptors.response.use(async res => {
        // 隐藏加载
        if (options.showLoader) {
            store.getState().app.loader.close()
        }
        return res;
    }, function (err) {
        // 隐藏加载
        if (options.showLoader) {
            store.getState().app.loader.close()
        }
        if (err.response) {
            // 统一处理错误
            const { status, data } = err.response
            const { errMsg } = data
            if (status === 401) {    //登录状态不存在
                logoutHandle()
            }
            store.getState().app.toast.show(errMsg, 2000)
        } else {
            //无网络-无响应
            store.getState().app.toast.show("请求超时", 2000)
        }
        return err.response;

    });
    return instance
}

export default createHttp