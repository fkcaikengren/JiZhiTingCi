package com.aitingci;

import android.app.Application;
import android.webkit.WebView;

import cn.jiguang.plugins.analytics.JAnalyticsPackage;
import cn.jiguang.plugins.push.JPushPackage;

import com.microsoft.codepush.react.CodePush;
import com.ali.feedback.FeedbackPackage;
import com.alibaba.sdk.android.feedback.impl.FeedbackAPI;
import com.reactlibrary.AlipayPackage;
import com.theweflex.react.WeChatPackage; 
import com.cmcewen.blurview.BlurViewPackage;
import com.facebook.react.ReactApplication;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import cn.reactnative.modules.qq.QQPackage;
import com.zyu.ReactNativeWheelPickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.kishanjvaghela.cardview.RNCardViewPackage;

import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.zmxv.RNSound.RNSoundPackage;
import io.realm.react.RealmReactPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;



public class MainApplication extends Application implements ReactApplication {


  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
   

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }
     @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new NotificationPackage(),
            new MainReactPackage(),
            new RNExitAppPackage(),
            new BackgroundTimerPackage(),
            new QQPackage(),
            new ReactNativeWheelPickerPackage(),
            new RNZipArchivePackage(),
            new FeedbackPackage(),
            new RNCWebViewPackage(),
            new ImagePickerPackage(),
            new BlurViewPackage(),
            new RNFetchBlobPackage(),
            new RNGestureHandlerPackage(),
            new RNCardViewPackage(),
            new SplashScreenReactPackage(),
            new SvgPackage(),
            new RealmReactPackage(),
            new AsyncStoragePackage(),
            new RNSoundPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage(),
            new RNSpinkitPackage(),
            new AlipayPackage(),
            new WeChatPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new JAnalyticsPackage(),
            new JPushPackage()

      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }



  
  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // 阿里百川的反馈模块初始化
    FeedbackAPI.init(this, "27947681","c132858beb95ea7b6b38c1576c25bace ");
   
  }

}

