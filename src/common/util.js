import * as CConstant from "./constant";
// import { NavigationActions, StackActions } from "react-navigation";
// import createHttp from "./http";
// import { store } from '../redux/store'

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

    // todo: 取消注释
    /**
     *   抹掉stack，跳转到指定路由 
     * @param navigation
     * @param routeName
     * @param params
     */
    // static goPageWithoutStack(navigation, routeName, params = {}) {
    //     const resetAction = StackActions.reset({
    //         index: 0,
    //         actions: [
    //             NavigationActions.navigate({ routeName, params })
    //         ]
    //     });
    //     navigation.dispatch(resetAction);
    // }


    // todo:取消注释
    /**
     * @description  
     * @return 时间准确返回true,否则返回false
     */
    // static async checkLocalTime() {
    //     //如果本地时间不对，提示修改手机时间
    //     const myHttp = createHttp(null, { shouldRefreshToken: true })
    //     const res = await myHttp.get('/timestamp')
    //     const d = res.data.timestamp - Date.now()
    //     console.log('时间差：  ' + d)
    //     if (d >= -10000 && d <= 10000) { //相差在10秒
    //         return true
    //     } else {
    //         // store.getState().app.toast.show('手机时间不准确，请调整时间后重试！', 3000)
    //         return false
    //     }
    // }

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

}