## 前言
此章节开始将讲插件配置项，此章节讲[html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)依赖，通过配置此依赖，可自动生成html，并自动引入构建后的资源文件

## 安装
```
npm install html-webpack-plugin --save-dev
```

## 配置项
- `title`：设置生成的html文件的标题，在视图页面使用`htmlWebpackPlugin.options.title`获取
- `filename`：生成html文件的文件名，默认为 index.html
- `template`：可以使用html模版引擎编译成html文件，也可以直接使用html文件。html模版引擎有: `pug`, `ejs`, `hbs`等但是要注意的是，使用自定义的模板文件时，需要提前安装对应的 loader， 否则webpack不能正确解析，默认为`ejs`
- `inject`：js/css编译后文件注入选项，有四个选项值：
    - `true`：默认值，script标签位于html文件的body底部（一般使用此值）
    - `body`：同true
    - `head`：script标签位于head标签内
    - `false`：不插入生成的js文件，单纯生成一个html文件
- `favicon`：设置html文件favicon，属性值为favicon所在的路径
- `minify`：对html文件进行压缩，属性值可以是一个选项或false，默认false，不对生成的html文件进行压缩；属性值当是选项的时候，选项配置可以参考html-minify配置选项，html-webpack-plugin 内部集成了html-minify
- `hash`：给生成的js文件设置一个hash值，该hash值是该次webpack编译时的hash值
    - `false`：默认不设置hash值
    - `true`：设置hash值
- `cache`：默认为true，表示只有在内容变化时才生成一个新的文件
- `showErrors`：当webpack编译出现错误，webpack将错误信息包裹在一个pre标签内，默认为true，显示错误信息
- `chunks`：chunks 选项的作用主要是针对多入口(entry)文件。当你有多个入口文件的时候，对应就会生成多个编译后的 js 文件。那么 chunks 选项就可以决定是否都使用这些生成的 js 文件。
chunks 默认会在生成的 html 文件中引用所有的 js 文件，当然你也可以指定引入哪些特定的文件。
- `excludeChunks` ：跟 chunks 是相反的，排除掉某些 js 文件，默认不排除
- `xhtml` ：兼容 xhtml 的模式引用文件，默认值是 false，则不兼容引用 ，如果为 true ,则兼容引用
- `chunksSortMode`：设置 script 标签的引用顺序。默认有四个选项，'none', 'auto', 'dependency', '{function}'

提示：默认支持[ejs](https://github.com/tj/ejs)模版引擎

## 使用
```
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfig = {
    plugins: [new HtmlWebpackPlugin()]
};
```

## 自定义配置
通过不同的参数再结合自己的需要来自定义添加参数来达到项目需求，例如：
```
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
    plugins: [
        new HtmlWebpackPlugin({
            favicon:'./xxx.ico',
            title: 'webpack脚手架教程',
            filename: "./bulid/index.html",
            template: "index.html",
            hash: true, 
        })
    ]
};
```

在视图中可以使用`htmlWebpackPlugin.options.xxxx`变量输出定义的字段值，例如，上面定义`title: 'webpack脚手架教程',`字段，那在视图中便可使用`htmlWebpackPlugin.options.title`输出
```
<!DOCTYPE html>
<html lang="cn">
<head>
    <meta charset="UTF-8">
    <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>

</body>
</html>
```

## 小技巧
既然在视图中可以使用`htmlWebpackPlugin.options.xxx`输出自定义的字段，那可根据实际业务需求在`new HtmlWebpackPlugin({})`的中添加对应的字段，然后再在html模版文件中使用`htmlWebpackPlugin.options.xxx`输出

`webpack.config.js`文件：
```
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
    plugins: [
        new HtmlWebpackPlugin({
            // ...
            
            text: "我是一个自定义且打酱油的文字...",
        })
    ]
};
```

html模版文件：
```
<!DOCTYPE html>
<html lang="cn">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    <h1><%= htmlWebpackPlugin.options.text %></h1>  
</body>
</html>
```

## 多页面配置
多页面便是使用多个`new HtmlWebpackPlugin()`，生成对应html文件
 
## 脚手架更新
#### `webpack.variable.js`文件更新片段的代码：
- 增加html插件配置
```
// ...

/**
 * html插件配置
 * @type {{title: string, filename, template, dllJs: string}}
 * @prop title      html中的title标签内容
 * @prop filename   构建后生成文件规则
 * @prop template   html模版文件
 */
VARIABLE.htmlPlugin = {
    title: "webpack脚手架教程",                                     
    filename: VARIABLE.getPath(VARIABLE.buildDir + "/index.html"),   
    template: VARIABLE.getPath("src/index.html"),                   
};

```

#### `webpack.config.js`文件更新片段的代码：
- 使用`html-webpack-plugin`依赖，先引入，后在`plugins`字段中配置
```
const HtmlWebpackPlugin = require('html-webpack-plugin'); 

module.exports = {
    // ...
    
    // 插件配置项
    plugins: [
        
        // 生成html插件配置项
        new HtmlWebpackPlugin({
            title: VARIABLE.htmlPlugin.title,
            filename: VARIABLE.htmlPlugin.filename,
            template: VARIABLE.htmlPlugin.template,
            hash: true,
        })
    ],
};
```

#### `src/index.html`文件更新片段的代码：
- 在html中使用`ejs`模版引擎语法输出`html-webpack-plugin`配置的字段
```
<!DOCTYPE html>
<html lang="cn">
<head>
    <meta charset="UTF-8">
    <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>

</body>
</html>
```

### 完整配置文件

#### `src/index.html`文件：
直接使用上述相关代码即可

#### `webpack.variable.js`完整文件代码：
```
const path = require("path"),
    VARIABLE = {};

/**
 * 获取path函数
 * @param src 根目录下的子文件路径
 */
VARIABLE.getPath = (src = "") => path.resolve(__dirname, src);

/**
 * 构建文件目录
 * @type {string}
 */
VARIABLE.buildDir = "./build";

/**
 * 入口文件路径配置
 * @type {string | array | object}
 */
VARIABLE.entry = [
    VARIABLE.getPath("src/index.js")
];

/**
 * 输出文件路径配置
 * @type {{path, publicPath: string, css: string, filename: string, fonts: string, media: string}}
 * @prop path         构建的文件目录规则
 * @prop publicPath   资源引用的公共路径规则
 * @prop filename     构建后生成文件规则
 * @prop css          构建后的样式文件规则
 * @prop fonts        构建后的字体图标文件规则
 * @prop media        构建后成的媒体文件(视频/音频)规则
 */
VARIABLE.output = {
    path: VARIABLE.getPath(VARIABLE.buildDir),                                    
    filename: `dist/js/[name].js`,                                     
    media: "dist/media/[name].[ext]",                 
    fonts: "dist/fonts/[name].[ext]",
    img: "dist/img/[name].[ext]",
    css: `dist/css/[name].css`,
    publicPath: "/",
};

/**
 * html插件配置
 * @type {{title: string, filename, template, dllJs: string}}
 * @prop title      html中的title标签内容
 * @prop filename   构建后生成文件规则
 * @prop template   html模版文件
 */
VARIABLE.htmlPlugin = {
    title: "webpack脚手架教程",                                        
    filename: VARIABLE.getPath(VARIABLE.buildDir + "/index.html"), 
    template: VARIABLE.getPath("src/index.html"), 
};

module.exports = VARIABLE;
```

#### `webpack.config.js`完整文件代码：
```
const webpack = require("webpack"),
    VARIABLE = require("./webpack.variable"),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    //入口文件配置项
    entry: VARIABLE.entry,

    // 输出文件配置项
    output: {
        path: VARIABLE.output.path,
        filename: VARIABLE.output.filename,
        publicPath: VARIABLE.output.publicPath,
    },

    // 加载器配置项
    module: {
        rules: [
            {
                test: /\.(scss|sass|css)$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "postcss-loader",
                    options: {
                        plugins: loader => [
                            require('autoprefixer')(),
                        ],
                        sourceMap: true,
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
            }, {

                // JS依赖配置项
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }

            }, {

                // 字体图标
                test: /\.(woff|woff2|svg|eot|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: VARIABLE.output.fonts,
                    },
                }],

            }, {

                // 文件依赖配置项——音频
                test: /\.(wav|mp3|ogg)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: VARIABLE.output.media,
                    },
                }],

            }, {

                // 文件依赖配置项——视频
                test: /\.(ogg|mpeg4|webm)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: VARIABLE.output.media,
                    },
                }],
            }, {

                // 文件依赖配置项——图片
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: VARIABLE.output.img,
                    },
                }],
            },
        ]
    },

    // 模版解析配置项
    resolve: {

    },

    // 插件配置项
    plugins: [

        // 生成html插件配置项
        new HtmlWebpackPlugin({
            title: VARIABLE.htmlPlugin.title,
            filename: VARIABLE.htmlPlugin.filename,
            template: VARIABLE.htmlPlugin.template,
            hash: true,
        }),
    ],

};
```

#### 运行webpack指令构建
```
webpack
```