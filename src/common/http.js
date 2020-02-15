import axios from 'axios';
import httpBaseConfig from './httpBaseConfig';
import { store } from '../redux/store'
import { DURATION } from 'react-native-easy-toast'
import { MODIFY_CREDENTIAL } from '../features/mine/redux/action/mineAction';
import { logoutHandle } from '../features/mine/common/userHandler';


const opt = {
    showLoader: false,
    showLoaderText: "加载中",
    shouldRefreshToken: false,
}

/**
 * @function 创建一个请求对象
 * @param  config 请求配置，为null时，则使用默认配置
 * @param  options 选项
 */
const createHttp = (config, options = opt) => {
    config = config ? config : httpBaseConfig
    config.headers.Authorization = store.getState().mine.credential.accessToken
    const instance = axios.create(config);

    //请求拦截处理
    instance.interceptors.request.use(async config => {
        //显示加载
        if (options.showLoader) {
            store.getState().app.loader.show(opt.showLoaderText, DURATION.FOREVER)
        }

        //判断是否过期
        const { accessToken, refreshToken, expiresIn } = store.getState().mine.credential
        if (opt.shouldRefreshToken && accessToken && expiresIn && Date.now() >= expiresIn) { //过期
            const tokenHttp = axios.create(httpBaseConfig);
            const tokenRes = await tokenHttp.post("/refreshToken", { refreshToken })
            if (tokenRes.status === 200) {
                console.log("--------------tokenRes-------------------")
                console.log(tokenRes.data)
                const credential = tokenRes.data
                //修改请求的Authorization
                config.headers.Authorization = credential.accessToken;
                //修改redux
                store.dispatch({ type: MODIFY_CREDENTIAL, payload: { credential } })
            }
        }

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
        // 统一处理错误
        const { status, data } = err.response
        const { errMsg } = data
        if (status === 401) {    //accessToken无效、refreshToken无效、刷新token失败
            logoutHandle()
        }
        store.getState().app.toast.show(errMsg, 2000)
        return err.response;

    });
    return instance
}


export default createHttp