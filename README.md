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


- fie qrzip

> 开启本地服务，用于将本地调试包快速上传至debug版客户端并替换客户端内的对应插件。






## 常见问题：

- 安装fie提示无权限

> 带sudo权限执行命令

- fie start提示缺少模块

> 执行fie clear后重新安装 

- 无法下载千牛客户端？

> 请使用手机UC扫码

其他问题反馈烦请 [提交ISSUE](https://github.com/fieteam/fie-toolkit-nuke/issues),或反馈到nuke旺旺群 1551341770

## 兼容性说明

兼容windows及mac系统，node >= 5.5.0.
