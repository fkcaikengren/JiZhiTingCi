package com.um;


import android.content.Context;

import com.um.utils.Constants;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;


/**
 * Created by Jacy on 17/9/14.
 */

public class UmengConfig {


    public static void init(Context context) {
        //接入分享
        PlatformConfig.setWeixin(Constants.KEY_WEIXIN, Constants.SECRET_WEIXIN);
//        PlatformConfig.setSinaWeibo(Constants.KEY_WEIBO, Constants.SECRET_WEIBO,"http://sns.whalecloud.com");
//        PlatformConfig.setQQZone(Constants.KEY_QQ, Constants.SECRET_QQ);

        initRN("react-native", "1.0");
        UMConfigure.setLogEnabled(true);
        // 接入推送
        // 接口一共五个参数，其中第一个参数为Context，第二个参数为友盟Appkey，第三个参数为channel，第四个参数为应用类型（手机或平板），第五个参数为push的secret（如果没有使用push，可以为空）
        UMConfigure.init(context, "5d7e273c3fc195984a0008f4", "official", UMConfigure.DEVICE_TYPE_PHONE, "3a19f4965704ed6def1400edc9fe86b7");

    }


    private static void initRN(String v, String t) {
        Method method = null;
        try {
            Class<?> config = Class.forName("com.umeng.commonsdk.UMConfigure");
            method = config.getDeclaredMethod("setWraperType", String.class, String.class);
            method.setAccessible(true);
            method.invoke(null, v, t);
        } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }


}