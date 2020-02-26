
import { Platform, PermissionsAndroid } from 'react-native'
import { NavigationActions, StackActions } from "react-navigation";
import NetInfo from "@react-native-community/netinfo"
import * as CConstant from "./constant";
import createHttp from "./http";
import { store } from '../redux/store'


export default class _util {



    /**
     *  从今天往后推的第nth天的零点时间戳。（当nth==0, 表示今天的零点时间戳）
     * @param nth
     * @returns {number} 零点时间戳
     */
    static getDayTime(nth) {
        return new Date(new Date().toLocaleDateString()).getTime() + nth * CConstant.DAY_MS
    }


    static getDaysMS(dayCount) {
        return dayCount * CConstant.DAY_MS
    }

    /**
     *   抹掉stack，跳转到指定路由 
     * @param navigation
     * @param routeName
     * @param params
     */
    static goPageWithoutStack(navigation, routeName, params = {}) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName, params })
            ]
        });
        navigation.dispatch(resetAction);
    }


    /**
     * @description  
     * @return 时间准确返回true,否则返回false
     */
    static async checkLocalTime() {

        //如果本地时间不对，提示修改手机时间
        const state = await NetInfo.fetch()
        if (!state.isConnected) {//未联网不检查
            return true
        }
        const myHttp = createHttp(null, { shouldRefreshToken: true })
        const res = await myHttp.get('/timestamp')
        const d = res.data.timestamp - Date.now()
        console.log('时间差：  ' + d)
        if (d >= -300000 && d <= 300000) { //相差在5min
            return true
        } else {
            store.getState().app.toast.show('手机时间不准确，请调整时间!', 2000)
            return false
        }
    }

    /**
     * 检查网络
     */
    static checkNet = (doAction) => {
        NetInfo.fetch().then(async (state) => {
            if (state.isConnected) {
                doAction()
            } else {
                store.getState().app.toast.show('请检查网络！', 1000)
            }
        })
    }

    /**
     *  @function 随机生成字符串
     */
    static generateMixed(n) {
        const chars =
            ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        let res = "";
        for (let i = 0; i < n; i++) {
            let id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }


    /**
     * @function 随机生成数字
     */
    static generateNum(n) {
        let m = 1
        for (let i = 1; i <= n; i++) {
            m = m * 10
        }
        return parseInt(Math.random() * m)
    }



    static formateTimestamp(timestamp) {
        if (timestamp) {
            var time = new Date(timestamp);
            var y = time.getFullYear();
            var M = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var m = time.getMinutes();
            var s = time.getSeconds();
            return [
                y + '-' + this.addZero(M) + '-' + this.addZero(d),
                this.addZero(h) + ':' + this.addZero(m) + ':' + this.addZero(s)
            ]
        } else {
            return ['', ''];
        }
    }


    static addZero(m) {
        return m < 10 ? '0' + m : m;
    }


    static async checkPermission() {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

        const rationale = {
            'title': '相册权限',
            'message': '需要您的相册权限来支持分享图片'
        };
        console.log('要相册权限------')
        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, rationale)
        console.log(result)
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
    }
}