# 英语听词（yingyutingci）

## 准备工作

### 初始化RN项目

react-native 版本：**0.59.8**

```
react-native init JiZhiTingCi
```

### vscode 同步设置到github

```

```

### vscode 同步代码到github

```

```



## 项目目录结构

英语App项目目录	
|-- project-name
|    |-- src
|    |    |-- common

|    |    |    +--redux
|    |    |    +-- dao
|    |    |    +-- net
|    |    |-- features

|    |    |    |-- vocabulary
|    |    |    |    |-- redux

|    |    |    |    |    |--action.js 	(总的action)
|    |    |    |    |    |--constant.js
|    |    |    |    |    |--reducer.js	(总的reducer)
|    |    |    |    |    |--vocaPlay.js	(某一个页面的功能集合)
|    |    |    |    |-- VocaPlayPage.js
|    |    |    |    |-- VocaListTabNavgator.js (导航页面)
|    |    |    |    |-- dao	(realm数据库操作)
|    |    |    |    |    |--vocaTaskDao 	
|    |    |    |    |-- net	(axios网络请求层)
|    |    |    |    |    |--AudioFetch	
|    |    |    +-- reading 	(阅读模块)
|    |    |    +-- gramma （语法模块）
|    |    +-- style  (全局样式)
|    |    +-- image （图片）
|    |    |	  |--App.js  （图片）



## 项目需求分析



## 安装第三方组件

### 安装ant-design库

```
yarn add @ant-design/react-native
yarn add babel-plugin-import （按需加载）
react-native link @ant-design/icons-react-native 
```



安装ant-design库



### 安装NativeBase库

需要link

```
yarn add native-base
```

### 安装react-navigator库

gesture-handler 需要link

```
yarn add react-navigation
yarn add react-native-gesture-handler 
```

### 安装eact-navigator库

```
yarn add react-native-vector-icons
```

### ~~安装react-native-progress库~~（拷贝源码）

```
yarn add react-native-progress
```

取消依赖，直接拷贝源码，然后修改源码：

```
修改Circle.js，修改如下

- formatText: PropTypes.func,
+ formatText: PropTypes.func,
- formatText: progress => `${Math.round(progress * 100)}%`,
+ formatText: progress => <Text> {`${Math.round(progress * 100)}%`}</Text>,


+{
+	formatText(progressValue)
+}
```





### 安装react-native-picker

```
yarn add react-native-picker
```

link

```
react-native link
$ pod install

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



### ~~安装redux-promise~~ (使用redux-saga替换)

```
yarn add redux-saga
```







### 安装redux-actions

```
yarn add redux-actions
```

### 安装redux-logger

```
yarn add redux-logger
```



### 安装react-native-sound

```
yarn add react-native-sound
手动link
```





### 安装rn-fetch-blob

```
yarn add rn-fetch-blob
手动link
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



### 实现数据模拟-安装mockjs

```
yarn add mockjs --dev
```





### 安装axios

```
yarn add axios
```





### 安装querystring

```
yarn add querystring
```





### 实现带可选索引的列表

[参考：带字母检索的SectionList](<https://www.jianshu.com/p/09dd60d7b34f>)

```
方式一：如果使用scrollToIndex()需要修改SectionList和VirtualizedSectionList的代码.
方式二：用scrollToLocation()替换scrollToIndex()
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



参考：<https://blog.csdn.net/Yuequnchen/article/details/86625223>



### 安装uuid（为realm生成uuid主键）

```
yarn add uuid
```



### 安装react-native-swiper

```
yarn add react-native-swiper 
```



### ~~安装react-native-shadow~~(使用react-native-cardview替换)

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



### 安装react-native-loader

```
yarn add react-native-loader
```



# 英语听词App