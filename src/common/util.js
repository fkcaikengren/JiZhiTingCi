import * as CConstant from "./constant";
import {NavigationActions, StackActions} from "react-navigation";


export default class _util{

    /**
     *  从今天往后推的第nth天的零点时间戳。（当nth==0, 表示今天的零点时间戳）
     * @param nth
     * @returns {number} 零点时间戳
     */
    static getDayTime(nth){
        // return new Date(new Date().toLocaleDateString()).getTime()
        return new Date(new Date().toLocaleDateString()).getTime() +nth*CConstant.DAY_MS
    }


    static getDaysMS(dayCount){
        return dayCount*CConstant.DAY_MS
    }

    /**
     *   抹掉stack，跳转到指定路由
     * @param navigation
     * @param routeName
     * @param params
     */
    static goPageWithoutStack = (navigation,routeName, params={})=>{
        const  resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName,params})
            ]
        });
        navigation.dispatch(resetAction);
    }


}