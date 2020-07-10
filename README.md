# 爱听词（aitingci）

## 准备工作

### 初始化RN项目

react-native 版本：**0.59.8**

```bash
react-native init aitingci
```

### 同步项目到github







## 项目功能简介

英语单词学习App



## 项目目录结构

英语App项目目录	

```
|-- aitingci
|    |-- src
|    |    +-- common
|	 |	  +-- component
|    |    |-- features (功能模块目录)
|    |    |    |-- vocabulary
|    |    |    |    |-- redux (状态管理)
|    |    |    |    |    +--action 	
|    |    |    |    |    |--home.js	
|    |    |    |    |    |--vocaPlay.js	
|    |    |    |    |-- HomePage.js
|    |    |    |    |-- dao	(realm数据库操作)
|    |    |    |    |    |--vocaDao 	
|    |    |    |    |    |--vocaTaskDao 	
|    |    |    +-- reading 	(阅读模块)
|    |    |    +-- mine （我的模块）
|    |    +-- style  (全局样式)
|    |    +-- image （图片）
|    |--App.js 
```





## 安装第三方组件

### 安装react-native-drawer库 

```
yarn add react-native-drawer
```

### 安装react-native-easy-grid

```
yarn add react-native-easy-grid
```

### 安装react-navigation库

gesture-handler 需要link

```
yarn add react-navigation
yarn add react-native-gesture-handler 
```

### 安装react-navigation-redux-helpers 

​	整合navigation 和redux

```
yarn add react-navigation-redux-helpers
```

### 安装react-native-vector-icons库

```
yarn add react-native-vector-icons
```

### 安装react-native-progress库

```js
//最新版本存在问题
yarn add react-native-progress@3.6.0

```

### 安装 react-native-check-box

```
yarn add react-native-check-box
```

### 安装react-native-calendars

```
yarn add react-native-calendars
```

### 安装react-native-popup-menu

```
yarn add react-native-popup-menu
```

### 安装react-native-modalbox

```
yarn add react-native-modalbox@latest
```

### 安装prop-types

```
yarn add prop-types
```

### 安装redux

```
yarn add redux
```

### 安装react-redux

```
yarn add react-redux
```

### 开发依赖安装redux-devtools

```
yarn add redux-devtools --dev
```

### 安装redux-saga

```
yarn add redux-saga
```

### 安装redux-actions

```
yarn add redux-actions
```

### 安装react-native-sound

```
yarn add react-native-sound
手动link
```

### 安装rn-fetch-blob

```
yarn add rn-fetch-blob
react-native link rn-fetch-blob 
```

### 安装react-native-storage

```
yarn add react-native-storage
yarn add @react-native-community/async-storage
react-native link @react-native-community/async-storage
```

### 安装redux-persist (实现数据持久化)

```
yarn add redux-persist
```

### 安装axios

```
yarn add axios
```

### 安装realm

```
yarn add realm
手动link
```

问题记录： 安装realm后，remotely debug会出现以下问题：

```
DOMException: Failed to execute 'send' on 'XMLHttpRequest'

V:\VSCode\English\JiZhiTingCi\node_modules\react-native\Libraries\Core\ExceptionsManager.js:74 Realm failed to connect to the embedded debug server inside the app

'Access to XMLHttpRequest at 'http://localhost:8081/create_session' from origin 'http://192.168.1.21:8081' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.'
 
'Must first create RPC session with a valid host'

'Unhandled JS Exception: Must first create RPC session with a valid host'
```

解决方法：

```
adb forward --list 【检查你的设备是否在名单里】
adb forward tcp:8083 tcp:8083 【建立连接】
然后参考链接，修改realm/lib/browser/rpc.js
```

```jsx
if (global.__debug__) {
    let request = global.__debug__.require('sync-request');
    let response = request('POST', url, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "text/plain;charset=UTF-8"
      }
    });

    statusCode = response.statusCode;
    responseText = response.body.toString('utf-8');
} else {
    let body = JSON.stringify(data);
    let request = new XMLHttpRequest();

    // 增加以下代码
    if (__DEV__) {
        url = 'http://localhost:8083' + url.substring(url.lastIndexOf('/'));
    }//增加上述代码

    request.open('POST', url, false);
    request.send(body);

    statusCode = request.status;
    responseText = request.responseText;
}

```

```
问题：error: more than one device/emulator
解决：taskkill /f /im adb.exe
```

参考：<https://blog.csdn.net/Yuequnchen/article/details/86625223>



### 安装uuid（为realm生成uuid主键）

```
yarn add uuid
```



### 安装react-native-swiper

```
yarn add react-native-swiper 
```

### 安装react-native-cardview

```jsx
yarn add react-native-cardview
手动link
```

### 安装react-native-parallax-scroll-view

```
yarn add react-native-parallax-scroll-view
```

### 安装react-native-svg

```
yarn add react-native-svg
手动link
```

### 安装react-native-linear-gradient

```
yarn add react-native-linear-gradient
手动link
```

### 安装react-native-spinkit

```
yarn add react-native-spinkit
手动link

```

### 安装react-native-webview

```jsx
yarn add react-native-webview
react-native link react-native-webview

```

### 安装react-native-collapsible (手风琴)

```
yarn add react-native-collapsible
```

### react-native-easy-toast

```
yarn add react-native-easy-toast
```

### 图片选择器 react-native-image-picker

```js
yarn add react-native-image-picker
react-native link react-native-image-picker

```

### 滚筒选择器react-native-wheel-picker

```js
yarn add react-native-wheel-picker
//手动link

```

issue:

**出现propTypes问题** 

采用其他pull后修复该问题的库

**"Build failed" when i go genarate de apk file "./gradlew assembleRelease"**

修改 build.gradle 文件

```js
compileSdkVersion 28 
buildToolsVersion "28.0.3" 
```

### 虚化背景@react-native-community/blur

```js
yarn add @react-native-community/blur
react-native link @react-native-community/blur

```

issue:android suppot 迁移到androidx 

【fixed】//修改Module.java

```js
import androidx.renderscript.Allocation;
import androidx.renderscript.Element;
import androidx.renderscript.RenderScript;
import androidx.renderscript.ScriptIntrinsicBlur;
```

### 压缩包react-native-zip-archive

```
yarn add react-native-zip-archive
```

### 后台计时react-native-background-timer

```
yarn add react-native-background-timer
```

### 退出Appreact-native-exit-app

```
yarn add react-native-exit-app
react-native link react-native-exit-app
```

### 拖拽排序列表react-native-sortable-listview 

```
yarn add react-native-sortable-listview
```

### View生成图片react-native-view-shot

```
yarn add react-native-view-shot
react-native link react-native-view-shot
```

### 检查网络信息@react-native-community/netinfo

```
yarn add @react-native-community/netinfo
react-native link @react-native-community/netinfo
```

### 用户反馈react-native-feedback

```
//集成阿里百川的反馈模块
yarn add react-native-feedback
```

### 实现带可选索引的列表

[参考：带字母检索的SectionList](<https://www.jianshu.com/p/09dd60d7b34f>)

```
方式一：如果使用scrollToIndex()需要修改SectionList和VirtualizedSectionList的代码.
方式二：用scrollToLocation()替换scrollToIndex()
```





# 调试

### 调试本地数据库

#### 借助Chrome浏览器查看realm数据库

##### 1.项目集成stetho

##### 2.打开chrome://inspect/ , 使用dev tool进行查看数据库

##### 3.集成第三方插件stetho_realm，才可以查看realm数据库

**参考：基本配置**    <https://github.com/uPhyca/stetho-realm>

**参考： support realm5.10.0**  <https://github.com/uPhyca/stetho-realm/issues/62>



遇到问题：

​	找不到stetho_realm， 找不到Realm

​	打开devtools ，点开realm数据库就出现 connect close.

最终方案：

```js
import com.facebook.stetho.Stetho;
import com.uphyca.stetho_realm.RealmInspectorModulesProvider;
import io.realm.Realm;
import io.realm.RealmConfiguration;

 
 // #todo:生产环境下注释
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
    //调试时查看数据库
    Stetho.initialize(
            Stetho.newInitializerBuilder(this)
                    .enableDumpapp(Stetho.defaultDumperPluginsProvider(this))
                    .enableWebKitInspector(RealmInspectorModulesProvider
                            .builder(this)
                            .withDeleteIfMigrationNeeded(true)
                            .build())
                    .build());
    //调试查看WebView
    WebView.setWebContentsDebuggingEnabled(true);
```



### 调试webview

安装spy-debugger

```jsx
npm install spy-debugger -g
```

参考：https://github.com/wuchangming/spy-debugger



# 测试

### 使用bookstory

参考<https://storybook.js.org/docs/guides/guide-react-native/>

```
cd my-project-directory
```

```
npx -p @storybook/cli sb init --type react_native
```

```
npm run storybook
```

问题1 :

```jsx
installation is not 100% automated.
To quickly run storybook, replace contents of your app entry with:
export default from './storybook';
```

意思是说：把入口文件（constant.js）的内容用上面这句代码替换。或者用下面的代码替换：

```
import StorybookUI from './storybook';
export default StorybookUI;
```

问题2：

```
Unable to resolve module `emotion-theming` from `V:\VSCode\English\JiZhiTingCi\node_modules\@storybook\react-native\dist\preview\constant.js`: Module `emotion-theming` does not exist in the Haste module map
```

解决：

```
yarn add emotion-theming --dev
yarn add @emotion/core --dev
```



### Jest测试

参考<https://www.jianshu.com/p/d4e447430c3c>

github demo: <https://github.com/yinghuiwang/A0624-rn-unit-test>

安装[Enzyme](http://airbnb.io/enzyme/)

```
yarn add enzyme enzyme-adapter-react-16 --dev
```

~~安装[react-native-mock](http://airbnb.io/enzyme/docs/guides/react-native.html)~~ 

```
yarn add react-native-mock --dev
```

不支持react16, 所以放弃react-native-mock

#### Jest测试fetch异步请求



#### jest操作realm时，for of语法报错

错误：_iterator3[(intermediate value)(intermediate value)(intermediate value)] is not a function

只能换成 for in的语法



### Node 测试计划模块

**详情：见文档docs/测试.md**



# Issue

### 1.使用react-native-webview-bridge时，react-native run-android 报错：

**Failed to install the following Android SDK packages as some licences have not been accepted**

解决办法：<https://www.rumoss.cn/archives/226/>

运行sdkmanager 同意安装所有包的证书即可。



### 2.升级至androidx

使用android studio `Refactor -> Migrate to AndroidX`



### 3.修改包名

App启动崩溃 -> 改包名,使用脚本修改，脚本地址：https://gist.github.com/dlew/5db1b780896bbc6f542e7c00a11db6a0



### 4.node12使用npm i出现  node-gyp 相关问题

1）can't find python 

​	需要安装python2.7, 配置环境变量。

2）gyp Error!

参考： https://blog.csdn.net/dahuzix/article/details/90728059 

3）node12 安装realm数据库出现编译问题

将node12降级到node10



### 5.点击App出现停顿后才打开

点击App出现停顿原因：加载集成的第三方模块，此时启动页未开启。

解决： https://github.com/crazycodeboy/react-native-splash-screen/issues/22 

```
//去除AppTheme中下面的代码
<item name="android:windowIsTranslucent">true</item>
//AppTheme添加
<item name="android:windowBackground">@drawable/launch_screen</item>
<item name="colorPrimaryDark">@android:color/transparent</item>
```



### 6.打正式包时，出现错误verifyReleaseResources  FAILED

**"Build failed" when i go genarate de apk file "./gradlew assembleRelease"**

需要修改的库：

```
react-native-wheel-picker
react-native-qq
```

修改 build.gradle 文件

```js
compileSdkVersion 28 
buildToolsVersion "28.0.3"
```



### 7.android9无法发送网络请求

​	注意：千万不要修改targetSdkVersion

​	修改AndroidManifist.xml 

```js
//在Application中添加 
android:usesCleartextTraffic="true"
```



### 8.部分android手机出现Text文字显示不完全

原因：fontWeight属性引起字体显示不完全

【参考】： https://blog.csdn.net/zwkkkk1/article/details/86642529 

【参考】： https://blog.csdn.net/qq_36538734/article/details/90641888 

在index.js入口文件添加代码：

```js
const defaultFontFamily = {
	...Platform.select({
		android: { fontFamily: 'Roboto' }
	})
};

const oldRender = Text.render;
Text.render = function(...args) {
	const origin = oldRender.call(this, ...args);
	return React.cloneElement(origin, {
		style: [defaultFontFamily, origin.props.style]
	});
};


```

### 9.android9手机Text过长，换行后显示不全

【参考】： https://juejin.im/post/5d3ebfc15188255d660e1002 

```js
//设置text的行高
```



# 集成

### 集成极光统计、极光推送

```js
yarn add jcore-react-native
yarn add janalytics-react-native
yarn add jpush-react-native 
//手动link
```

**issues:**

issue1

```js
程序包cn.jpush.reactnativejanalytics不存在
程序包cn.jpush.reactnativejpush不存在
...找不到符号
new JAnalyticsPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
```

解决：包名地址不对，检查源文件。

改为：

```
import cn.jiguang.plugins.analytics.JAnalyticsPackage;
import cn.jiguang.plugins.push.JPushPackage;
```

然后报错：

```js
无法将类 JPushPackage中的构造器 JPushPackage应用到给定类型
new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
需要: 没有参数
找到: boolean,boolean
原因: 实际参数列表和形式参数列表长度不同
```

解决：删除两个参数：SHUTDOWN_TOAST, SHUTDOWN_LOG

issue2: 【fixed】

```js
找不到：JAnalyticsInterface
```

修改:

jcore-react-native
janalytics-react-native
jpush-react-native 

里面的build.gradle文件， 把依赖中的implement改为api

### 集成支付宝支付

```bash
yarn add @0x5e/react-native-alipay
```

issue: 【fixed】

解决冲突utdid类冲突，用alipaySdk-15.6.8-20191021122455-noUtdid.arr替换android/libs下的arr文件

需要修改：@0x5e/react-native-alipay/android/build.gradle：

```js
//compile(name: 'alipaySdk-15.5.9-20181123210601', ext: 'aar')
compile(name: 'alipaySdk-15.6.8-20191021122455-noUtdid', ext: 'aar')
```



### 集成微信登录、支付

```bash
yarn add react-native-wechat
```

issue: 【fixed】 迁移至androidx，需修改 WeChatModule ：

```js
//import android.support.annotation.Nullable;
import androidx.annotation.Nullable;
```



### 集成QQ登录、分享

```
yarn add react-native-qq
react-native link react-native-qq
```

【必读参考】： https://www.jianshu.com/p/a493f6f92b34 

issue: 【fixed】分享纯图片时模糊

//修改QQModule.java   把下面的：

```js
if (data.hasKey(RCTQQShareImageUrl)){
	bundle.putString(QQShare.SHARE_TO_QQ_IMAGE_URL,data.getString(RCTQQShareImageUrl));
}
```

修改为：

```js
//代码移动到函数最上方---start
String type = RCTQQShareTypeNews;
if (data.hasKey(RCTQQShareType)) {
    type = data.getString(RCTQQShareType);
}
//代码移动到函数最上方---end

//修改--start
if (!type.equals(RCTQQShareTypeImage)){
   if (data.hasKey(RCTQQShareImageUrl)){
 	bundle.putString(QQShare.SHARE_TO_QQ_IMAGE_URL,data.getString(RCTQQShareImageUrl));
   }
 }
//修改--end
```

issue:【fixed】 分享的纯图片为空

解决：文件路径不正确，不能使用应用程序下的目录，最后使用

issue: 【fixed】App如果没有文件读写权限则无法唤起QQ分享

解决：使用react-native库的PermissionsAndroid获取权限

issue:【todo】QQ未安装判断

解决：在react-native-qq的index.js文件中添加

```js
export function isQQInstalledAction() {
    return QQAPI.isQQInstalled().then((res) => {
        () => waitForResponse("QQAuthorizeResponse")
    })
}
```



# 发布

### 安装react-native-code-push（热更新）

```
yarn add react-native-code-push
react-native link react-native-code-push
```



### 部署发布

```bash
#添加部署
code-push deployment add aitingci Production
code-push deployment add aitingci Staging

#查看部署
code-push deployment ls aitingci -k

#开发环境热更新
code-push release-react aitingci android --dev true --d Staging --des "第一次打包测试" --m true

#生产环境热更新
code-push release-react aitingci android --dev false --d Production --des "爱听词1.0版" --m true

#删除部署
code-push deployment rm aitingci Production
code-push deployment rm aitingci Staging

#说明--m true 强制用户更新
```



### 打包命令

```bash
#查看签名
keytool -list -v -keystore aitingci.jks

//进入android目录后打包
./gradlew assembleStaging
./gradlew assembleRelease

```







### 注意：更新问题

```
更新App，进入App后操作，App会在后台更新，更新完成后导致App重启
```



### 上传商店：权限问题

```js
//取消极光推送里面的权限
//jpush-react-native
//janalytics-react-native
ACCESS_COARSE_LOCATION 	//GPS定位
ACCESS_FINE_LOCATION 	//网络大致定位
WRITE_SETTINGS  		//修改系统设置
//把AndroidManifest.xml中带有LOCATION的权限都注释掉
```

