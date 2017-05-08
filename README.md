# fie-toolkit-nuke

## changelog 

当前版本 0.0.1 试用版本


## 说明

集成了nuke、rax-redux等常用weex rax开发工具。小巧灵活，适用于千牛qap开发。


## 用法

### 安装fie脚手架体系 [FIE](https://github.com/fieteam/fie)

> npm install fie -g --registry=https://registry.npm.taobao.org

### 初始化nuke项目

```

fie init nuke

```

可选择初始化的项目类型，目前支持**千牛qap**项目，其他业务应用还在开发中。

### 开启本地服务器

```

fie start

```

**需占用本地的8080 、8088、3000三个端口号**

### 构建

```

- fie build

> qap应用将被打成zip，用于上传离线包

- 内置 qap插件支持内置，内置详情参见[内置文档](http://nuke.taobao.org/nukedocs/changelog/changes-of-buildin-vendor.html)

> 同时会生成用于降级的html页面，用户需自行发布，并将回调地址填入千牛开发者平台。

```

### 快捷命令  fie add xxxx

在`fie.config.js`中添加如下的字段，则默认会将项目template文件夹下的simple目录的内容添加到`./src/pages/`目录下。具体使用参考默认生成的demo项目。

```
addPath: {
      simple: {path: './src/pages/'},
      redux: { path: './src/pages/' },
      data: { path: './data/',suffix:'json'},
      h5:{path:'./h5/',suffix:'html'}
    }

```


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
