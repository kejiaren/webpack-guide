## Webpack是什么？
Webpack 是一个前端资源加载/打包工具。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。

[webpack文档](http://webpack.github.io/docs/) 

## Webpack优势
- webpack 是以 commonJS 的形式来书写脚本，但对 AMD/CMD 的支持也很全面，方便旧项目进行代码迁移
- 模块化
- 扩展性强，插件丰富
- 开发便捷，比如压缩混淆、图片转base64、GZIP压缩等
- 按需加载

## 项目结构
```
+webackScaffold
    |-build/dev            #构建后生成的生产环境/开发环境文件夹
    |    |-dist       
    |    |    |-fonts         
    |    |    |-img
    |    |    |-js
    |    |    |-media      #audios、videos资源文件夹
    |    |    |-style
    |    |    |-vendor
    |    |    
    |    |-index.html
    |    
    |-src                   #源文件夹
    |    |-assets           #资源文件
    |    |    |-audios          
    |    |    |-fonts         
    |    |    |-img
    |    |    |-js
    |    |    |-style
    |    |    |-videos
    |    |    
    |    |-index.js         #应用js根文件
    |    |-index.html       #html模版文件
    |
    |-server.js             #服务器配置文件
    |-webpack.config.js     #webpack配置文件
    |-webpack.dll.js        #webpack DLL配置文件
    |-webpack.variable.js   #webpack配置变量
```
根据上述所示项目结构创建相关文件夹（`dev`、`build`文件夹无需创建！！！

## 安装
首先先使用npm全局安装
```
npm install webpack -g
```

检查是否安装成功或安装的版本
```
webpack -v
```

全局安装完后，在项目根目录下安装npm说明文件`package.json`，此文件蕴含了丰富的信息，包括当前项目的依赖模块，自定义的脚本任务等等
```
npm init -y
```
然后会在项目根目录下生成一个`package.json`文件

本地安装webpack
```
npm install webpack -D
```

安装指定版本(依赖包名+ @ + 版本号)，例如webpack@x.x.x，其他依赖模块类似
```
npm install webpack@x.x.x -D
```


## 构建命令
常用webpack构建命令
- `webpack`：最基本的启动webpack命令

- `webpack -p`：对打包后的文件进行压缩

- `webpack -watch`/`webpack -w`：监听变化并自动打包

- `webpack -d`：提供SourceMaps，方便调试

- `webpack --config fileName`：配置另一份文件（fileName为需要配置的文件名）

- `webpack --progress`：显示编译进度

- `webpack --display-error-details`：显示异常信息

- `webpack --display-modules`：默认情况下```node_modules```下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块

## Webpack的配置主要几大项目：
- entry：js入口源文件配置项
- output：生成文件配置项
- module：加载器配置项
- resolve：模版解析配置项
- plugins：插件配置项
- externals：插件配置项

## 脚手架
边学边完善，依赖上述项目结构

先搭建个空架子先，后续，一边学习，一边填充

#### `webpack.config.js`文件：
```
const path = require("path"),
    webpack = require("webpack");

module.exports = {
    //入口文件配置项
    entry: "",

    // 输出文件配置项
    output: {
        
    },

    // 加载器配置项
    module: {
        
    },

    // 模版解析配置项
    resolve: {

    },

    // 插件配置项
    plugins: [

    ],

};
```


