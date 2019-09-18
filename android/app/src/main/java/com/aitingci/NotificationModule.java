package com.aitingci;

import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.support.annotation.Nullable;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.view.View;
import android.view.WindowManager;
import android.widget.RemoteViews;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;

/**
 *  通知栏模块
 */
public class NotificationModule extends ReactContextBaseJavaModule {

    //通知栏
    private ReactApplicationContext reactContext;
    private ButtonBroadcastReceiver bReceiver;
    private NotificationManagerCompat notificationManagerCompat;
    private NotificationCompat.Builder notificationBuilder;
    private NotificationManager notificationManager;

    //悬浮窗
    private WindowManager mWindowManager;
    private WindowManager.LayoutParams mWmParams;
    private View mFloatView;

    //常量
    private static final String PALYER_TAG = "com.aitingci";
    private static final String CHANNEL_NAME = "com.aitingci";//渠道名字
    private static final String CHANNEL_ID = "com.aitingci"; // 渠道ID
    private static final String description = "爱听词播放控制条"; // 渠道解释说明

    private static final String STATUS_CLOSE = "STATUS_CLOSE";
    private static final String STATUS_PLAY = "STATUS_PLAY";
    private static final String STATUS_PAUSE = "STATUS_PAUSE";



    public NotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        //初始化
        this.initNotification();
        this.initButtonReceiver();
    }


    @Nonnull
    @Override
    public String getName() {
        return "NotificationManage";
    }



    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }


    /**
     *  初始化通知栏
     */
    @SuppressLint("RestrictedApi")
    public void initNotification(){
        notificationManagerCompat = NotificationManagerCompat.from(this.reactContext);
        //1.创建RemoteViews实例
        RemoteViews smallView = new RemoteViews(this.reactContext.getPackageName(), R.layout.smallview_layout);
        RemoteViews bigView = new RemoteViews(this.reactContext.getPackageName(), R.layout.bigview_layout);
        //2.为通知栏的按钮添加监听：PendingIntent
        //点击通知栏导航到MainActivity
        Intent mainIntent = new Intent(this.reactContext, MainActivity.class);
        mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent mainPendingIntent = PendingIntent.getActivity(this.reactContext, 0, mainIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        // 点击关闭安钮，清空通知栏
        Intent intent = new Intent(PALYER_TAG);
        intent.putExtra("status",STATUS_CLOSE);
        PendingIntent pIntentCancel = PendingIntent.getBroadcast(this.reactContext, 1, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        bigView.setOnClickPendingIntent(R.id.big_closeBtn, pIntentCancel);
        smallView.setOnClickPendingIntent(R.id.small_closeBtn, pIntentCancel);
        //3.创建一个Notification
        notificationBuilder = new NotificationCompat.Builder(this.reactContext, CHANNEL_ID)
                .setSmallIcon(R.mipmap.h_icon)
                .setContent(smallView)
                .setCustomBigContentView(bigView)
                .setContentIntent(mainPendingIntent)
                .setDeleteIntent(pIntentCancel)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setOngoing(true)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC);
        //4. 兼容android 8
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            this.notificationManager = this.reactContext.getSystemService(NotificationManager.class);
            this.notificationManager.createNotificationChannel(channel);
            notificationBuilder.setOnlyAlertOnce(true);
        }


    }

    /**
     * 初始化广播接收器
     */
    public void initButtonReceiver() {
        bReceiver = new ButtonBroadcastReceiver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(PALYER_TAG);
        this.reactContext.registerReceiver(bReceiver,intentFilter);
    }

    /**
     *  发送事件
     * @param reactContext
     * @param eventName
     * @param params
     */
    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }





    /**
     *  开始播放
     */
    @SuppressLint("RestrictedApi")
    @ReactMethod
    public void play(Callback errorCallback,
                     Callback successCallback){

        try{
            //点击暂停按钮
            Intent intent = new Intent(PALYER_TAG);
            intent.putExtra("status",STATUS_PAUSE);
            PendingIntent pIntentPause = PendingIntent.getBroadcast(getReactApplicationContext(), 3, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            this.notificationBuilder.getBigContentView().setOnClickPendingIntent(R.id.big_playBtn, pIntentPause);
            this.notificationBuilder.getBigContentView().setImageViewResource(R.id.big_playBtn, R.drawable.ic_pause);
            if(this.notificationBuilder.getContentView() != null){
                this.notificationBuilder.getContentView().setOnClickPendingIntent(R.id.small_playBtn, pIntentPause);
                this.notificationBuilder.getContentView().setImageViewResource(R.id.small_playBtn, R.drawable.ic_pause);
            }

            this.notificationManagerCompat.notify(PALYER_TAG, 1, this.notificationBuilder.build());
            if(successCallback != null){
                successCallback.invoke();
            }
        }catch (Exception e){
            if(errorCallback != null){
                errorCallback.invoke(e.getMessage());
            }
        }

    }

    /**
     * 暂停
     */
    @SuppressLint("RestrictedApi")
    @ReactMethod
    public void pause(Callback errorCallback,
                      Callback successCallback){
        try{
            // 点击播放按钮
            Intent intent = new Intent(PALYER_TAG);
            intent.putExtra("status",STATUS_PLAY);
            PendingIntent pIntentPlay = PendingIntent.getBroadcast(getReactApplicationContext(), 2, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            this.notificationBuilder.getBigContentView().setOnClickPendingIntent(R.id.big_playBtn, pIntentPlay);
            this.notificationBuilder.getBigContentView().setImageViewResource(R.id.big_playBtn, R.drawable.ic_play);
            if(this.notificationBuilder.getContentView() != null){
                this.notificationBuilder.getContentView().setOnClickPendingIntent(R.id.small_playBtn, pIntentPlay);
                this.notificationBuilder.getContentView().setImageViewResource(R.id.small_playBtn, R.drawable.ic_play);
            }


            this.notificationManagerCompat.notify(PALYER_TAG,1, this.notificationBuilder.build());
            if(successCallback != null){
                successCallback.invoke();
            }
        }catch (Exception e){
            if(errorCallback != null){
                errorCallback.invoke(e.getMessage());
            }
        }
    }

    /**
     *  关闭应用
     */
    public void close(Callback errorCallback,
                      Callback successCallback){
        try{
            if (this.notificationManagerCompat !=null){
                this.notificationManagerCompat.cancel(PALYER_TAG,1);//通过tag和id,清除通知栏信息
            }
            getReactApplicationContext().unregisterReceiver(bReceiver);
            if(successCallback != null){
                successCallback.invoke();
            }
        }catch (Exception e){
            if(errorCallback != null){
                errorCallback.invoke(e.getMessage());
            }
        }
    }

    /**
     * 更新notificaton 的word
     */
    @SuppressLint("RestrictedApi")
    @ReactMethod
    public void updateWord(String word, Callback errorCallback, Callback successCallback) {
        try{
            this.notificationBuilder.getBigContentView().setTextViewText(R.id.big_word, word);
            this.notificationManagerCompat.notify(PALYER_TAG, 1, this.notificationBuilder.build());
            if(successCallback != null){
                successCallback.invoke();
            }
        }catch (Exception e){
            if(errorCallback != null){
                errorCallback.invoke(e.getMessage());
            }
        }
    }




    /**
     * 广播接收类
     */
    public  class ButtonBroadcastReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if(action.equals(PALYER_TAG)){
                String status = intent.getStringExtra("status");

                System.out.println("---------------- status ----------");
                System.out.println(status);
                WritableMap params = Arguments.createMap();
                switch (status){
                    case "STATUS_CLOSE":
                        System.out.println("-------clear-----");
                        close(null, null);
                        sendEvent(reactContext, "closeAction", params);
                        break;
                    case "STATUS_PAUSE":
                        pause(null, null);
                        sendEvent(reactContext, "pauseAction", params);
                        break;
                    case "STATUS_PLAY":
                        play(null, null);
                        sendEvent(reactContext, "playAction", params);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}