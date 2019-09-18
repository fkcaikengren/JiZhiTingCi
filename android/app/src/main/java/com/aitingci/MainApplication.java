package com.aitingci;

import android.app.Application;
import android.webkit.WebView;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.stetho.Stetho;
import com.horcrux.svg.SvgPackage;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import com.aitingci.BuildConfig;
import com.kishanjvaghela.cardview.RNCardViewPackage;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.umeng.UmengReactPackage;
import com.umeng.commonsdk.UMConfigure;
import com.uphyca.stetho_realm.RealmInspectorModulesProvider;
import com.zmxv.RNSound.RNSoundPackage;

import java.util.Arrays;
import java.util.List;

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
             new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new BackgroundTaskPackage(),
            new RNCWebViewPackage(),
            new SvgPackage(),
            new RealmReactPackage(),
            new AsyncStoragePackage(),
            new RNFetchBlobPackage(),
            new RNSoundPackage(),
            new PickerViewPackage(),
            new RNGestureHandlerPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage(),
            new RNCardViewPackage(),
            new RNSpinkitPackage(),
            new BackgroundTimerPackage()
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
    super.onCreate();

    //Realm初始化
    Realm.init(this);
    RealmConfiguration configuration = new RealmConfiguration.Builder()
            .name(Realm.DEFAULT_REALM_NAME)
            .schemaVersion(0)
            .deleteRealmIfMigrationNeeded()
            .build();
    Realm realm =  Realm.getDefaultInstance();
    Realm.setDefaultConfiguration(configuration);
    Stetho.initialize(
            Stetho.newInitializerBuilder(this)
                    .enableDumpapp(Stetho.defaultDumperPluginsProvider(this))
                    .enableWebKitInspector(RealmInspectorModulesProvider
                            .builder(this)
                            .withDeleteIfMigrationNeeded(true)
                            .build())
                    .build());

    realm.close();

    //运行调试WebView
    WebView.setWebContentsDebuggingEnabled(true);


    //后台任务服务初始化
    BackgroundTaskPackage.useContext(this);

    //友盟初始化
    UMConfigure.init(this, UMConfigure.DEVICE_TYPE_PHONE,"");
  }
}
