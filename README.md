# fie-toolkit-nuke


## 说明

集成了nuke、rax-redux等常用weex rax开发工具。小巧灵活，手淘weex、千牛qap一网打尽，居家旅行必备良品。


## nuke业务开发详细文档见

## 用法

### 初始化

```
fie init nuke
```

可选择初始化的项目类型，目前支持**nuke普通项目**及**千牛qap**项目

### 开启本地服务器

```
fie start
```

将会启动三个html页面。

- 配置页面：检查本地是否有模拟器开发环境，并提供ios模拟器调试的最佳实践,请在该页面进行扫码。

- h5预览:weex在Html5的表现

- weex-devtool调试页面:在配置页面扫码完成后，在该页面进行调试。

### 构建

```
- fie build

> qap应用将被打成zip，用于上传离线包

- 内置 qap插件支持内置，内置详情参见[内置文档](http://nuke.taobao.org/nukedocs/changelog/changes-of-buildin-vendor.html)


```


### 发布  
```
fie publish
```
两种发布形式：

- qap 离线zip   **todo:千牛服务端未提供接口,需手动上传至qnconsole**

 - fie publish zip

- awp package  **done:调用fie-plugin-awp**

**如果本机从未使用过fie-awp，需调用fie awp config录入用户的awp平台appkey等基础信息**

 - fie publish -d  '日常'
 - fie publish -p  '线上'


## fie.config.js 配置

```javascript
  module.exports = {
    // 当前项目使用的fie套件
    toolkit: 'fie-toolkit-nuke',

    toolkitConfig: {
      // 本地服务器端口号
      port: 8080,
      // 是否自动打开浏览器
      open: true,
      // 打开浏览器后 自动打开的 目标页面
      openTarget: 'demos/index.html',
      // 文件修改后是否自动刷新浏览器
      liveload: true
    },
    tasks: {
      build: [
        {
          // 同步版本号
          command: 'fie git sync'
        },
        {
          // 检测dependencies中的版本依赖
          command: 'fie check'
        }
      ],
      publish: [],
      open: [
        {
          // 打开gitlab上的项目
          command: 'fie git open'
        }
      ]
    },
    //awp设置只在rax项目中存在
    awp: {
        awpPackage: {
            dailyAppID: '702',
            onlineAppID: '***',
            zipDir: 'dest.zip'
        }
    }
  };
```
