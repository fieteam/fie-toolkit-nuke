## fie-toolkit-nuke

toolkit-nuke是基于[FIE](https://github.com/fieteam/fie)体系的专为开发千牛QAP及其他基于RAX的项目脚手架。

## Quick Start

- 安装FIE
 
 `npm install fie -g --registry=https://registry.npm.taobao.org`

- 安装toolkit-nuke

 `fie install toolkit-nuke`

- 初始化FIE运行环境，ISV用请切换环境为外网

 `fie switch`

<img src='http://img.alicdn.com/tfs/TB1.wN0RXXXXXcAXpXXXXXXXXXX-470-83.png' width="400px"/>

- 初始化`rax nuke或qap`项目

 `fie init nuke` 
 
 <img src="https://img.alicdn.com/tfs/TB1s_FCRXXXXXXsaXXXXXXXXXXX-462-51.png" width="400px"/>

其中group指的是项目的gitlab group,ISV用户无需关注。

- 开启调试

 `fie start` 
	
<img src="https://img.alicdn.com/tfs/TB1kftJRXXXXXaOXVXXXXXXXXXX-663-221.png" width="400px" />

## 调试过程参考

<iframe height=450 width=650 src="http://cloud.video.taobao.com//play/u/2527597559/p/2/e/6/t/1/55514078.mp4"></iframe>
	
## 其他命令

- fie add

> 在fie.config.js中添加如下的字段，则默认会将项目template文件夹下的simple目录的内容添加到./src/pages/目录下。具体使用参考默认生成的demo项目。

```
addPath: {
      simple: {path: './src/pages/'},
      redux: { path: './src/pages/' },
      data: { path: './data/',suffix:'json'},
      h5:{path:'./h5/',suffix:'html'}
    }

```


- fie build

> qap应用将被打成zip，用于上传离线包

> 内置 qap插件支持内置，内置详情参见[内置文档](http://nuke.taobao.org/nukedocs/changelog/changes-of-buildin-vendor.html)

> 同时会生成用于降级的html页面，用户需自行发布，并将回调地址填入千牛开发者平台。

<img src="https://img.alicdn.com/tfs/TB1nXOXRXXXXXcFXXXXXXXXXXXX-681-437.png"  width="400px" />

- fie qrzip

> 开启本地服务，用于将本地调试包快速上传至debug版客户端并替换客户端内的对应插件。开发者使用手机扫码即可完成。

<img src ="https://img.alicdn.com/tfs/TB1QxCdRXXXXXaGXXXXXXXXXXXX-678-760.png" width="400px" />

## 常见问题：

- 如何在非千牛环境下运行？

> 使用按需引用的方式引用nuke组件，避开千牛特有组件[列表](http://easy-mock.com/mock/5954c9759adc231f356da959/components/diff/nuke/diff)，将qap-sdk替换为rax 自己的fetch方法。在发布时单独发布build文件夹中的js资源，并选择目标客户端支持的方式进行投放。


- 安装fie提示无权限

> 带sudo权限执行命令

- fie start提示缺少模块

> 执行fie clear后重新安装 

- 无法下载千牛客户端？

> 请使用手机UC扫码

- andorid端看不到source-map？

> 修改wepback的config文件sourcemap为 `config.devtool = 'inline-cheap-module-source-map';`

- 如何降级发布？

> 执行fie build后会生成`www`目录用于降级发布。单独发布js文件，并修改html资源引用为对应的线上js地址即可。

- 如何控制降级发布的资源依赖和html页面模板？

> 修改根目录下的template.html文件，一般无需修改。


其他问题反馈烦请 [提交ISSUE](https://github.com/fieteam/fie-toolkit-nuke/issues),或反馈到nuke旺旺群 1551341770




## 兼容性说明

兼容windows及mac系统， 5.5.0 <= node < 8.0.0.


## changelog

```
[
    {
      "version": "0.0.1",
      "log": [
        "init:提供外部用户使用"
      ]
    },
    {
      "version": "0.0.2",
      "log": [
        "feature:使用数据收集"
      ]
    },
    {
      "version": "0.0.2",
      "log": [
        "fix:retcode未引入"
      ]
    },
    {
      "version": "0.0.3",
      "log": [
        "fix:reponame重命名"
      ]
    },
    {
      "version": "0.0.4",
      "log": [
        "fix:未携带repo名称"
      ]
    },
    {
      "version": "0.0.6",
      "log": [
        "fix:调试页面稳定性升级"
      ]
    },
    {
      "version": "0.0.7",
      "log": [
        "fix:fie.config.js配置文件简化"
      ]
    }
  ]
```