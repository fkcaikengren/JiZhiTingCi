package com.aitingci;

import android.app.Application;
import android.util.Log;
import android.webkit.WebView;



import com.um.UmengConfig;
import com.um.UmengReactPackage;
import com.umeng.message.IUmengRegisterCallback;
import com.umeng.message.PushAgent;
import com.ali.feedback.FeedbackPackage;
import com.alibaba.sdk.android.feedback.impl.FeedbackAPI;
import com.reactlibrary.AlipayPackage;
import com.theweflex.react.WeChatPackage; 
import com.cmcewen.blurview.BlurViewPackage;
import com.facebook.react.ReactApplication;
import com.zyu.ReactNativeWheelPickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.stetho.Stetho;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.kishanjvaghela.cardview.RNCardViewPackage;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.uphyca.stetho_realm.RealmInspectorModulesProvider;
import com.zmxv.RNSound.RNSoundPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

import androidx.multidex.MultiDex;
import io.realm.Realm;
import io.realm.RealmConfiguration;
import io.realm.react.RealmReactPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
         new UmengReactPackage(),
            new NotificationPackage(),
            new MainReactPackage(),
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
             new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new SvgPackage(),
            new RealmReactPackage(),
            new AsyncStoragePackage(),
            new RNSoundPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage(),
            new RNSpinkitPackage(),
            new BackgroundTimerPackage(),
            new AlipayPackage(),
            new WeChatPackage()
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
    MultiDex.install(this);
    SoLoader.init(this, /* native exopackage */ false);

    //Realm初始化
    Realm.init(this);
    RealmConfiguration configuration = new RealmConfiguration.Builder()
            .name(Realm.DEFAULT_REALM_NAME)
            .schemaVersion(0)
            .deleteRealmIfMigrationNeeded()
            .build();
    Realm realm =  Realm.getDefaultInstance();
    Realm.setDefaultConfiguration(configuration);
    realm.close();
    Stetho.initialize(
            Stetho.newInitializerBuilder(this)
                    .enableDumpapp(Stetho.defaultDumperPluginsProvider(this))
                    .enableWebKitInspector(RealmInspectorModulesProvider
                            .builder(this)
                            .withDeleteIfMigrationNeeded(true)
                            .build())
                    .build());
    

    //运行调试WebView
    WebView.setWebContentsDebuggingEnabled(true);


    //友盟初始化
    UmengConfig.init(this);
    //分享初始化
    initPush();

    //阿里百川的反馈模块初始化
    FeedbackAPI.init(this, "27947681","c132858beb95ea7b6b38c1576c25bace ");

  }


  private void initPush(){
    PushAgent.getInstance(this).register(new IUmengRegisterCallback(){

      @Override
      public void onSuccess(String s) {
        Log.i("walle", "--->>> onSuccess, s is " + s);
      }

      @Override
      public void onFailure(String s, String s1) {
        Log.i("walle", "--->>> onFailure, s is " + s + ", s1 is " + s1);
      }
    });
  }
}

