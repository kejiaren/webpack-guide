## 前言
开发，难免离不开调试，在编译后的文件上做调试是一件非常头疼的事，不过可以通过配置`devtool`来调试代码，它能够定位到源文件相关信息，方便调试；[阮一峰Map科普文](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

## 配置项
使用不同配置项，会有不同的效果：
- `eval`：每个module会封装到`eval`里包裹起来执行，并且会在末尾追加注释` //# sourceURL`
- `source-map`：生成一个`.map`后缀文件，里面有相关配置信息
- `hidden-source-map`：和`source-map`一样，生成一个`.map`后缀文件，但不会在编译后的文件末尾追加注释
- `inline-source-map`：可以看到末尾的注释`sourceMap`作为`DataURL`的形式被内嵌进了编译后文件中，由于`sourceMap`的所有信息都被加到了编译文件中，整个编译文件变得硕大无比
- `eval-source-map`：和`eval`类似，但是把注释里的`sourceMap`都转为了`DataURL`
- `cheap-source-map`：和`source-map`生成结果差不多，也会生成`.map`后缀文件，`.map`后缀文件的配置信息比前者精简些
- `cheap-module-source-map`：和`source-map`、`cheap-module-source-map`生成结果差不多，也会生成`.map`后缀文件，`.map`后缀文件的配置信息比前两者更精简

webpack不仅支持这7种，而且它们还是可以任意组合上面的`eval`、`inline`、`hidden`关键字，就如文档所说，你可以设置`souremap`选项为`cheap-module-inline-source-map`

如果你的modules里面已经包含了`SourceMaps`，你需要用`source-map-loader` 来和合并生成一个新的`SourceMaps`

## 使用
```
module.exports = {
  devtool: "eval",
  // ...
};
```

## 示例
光有概念怎么行呢，下面将列出打包编译后的结果，从中看看有何异同

### eval
源文件：
```
console.log(1)
```

编译后的文件：
```
webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconsole.log(1);\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/public/js/index.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/public/js/index.js?");

/***/ })
],[0]);
```
`eval`模式会把每个module封装到`eval`里包裹起来执行，并且会在末尾追加注释

### source-map
源文件：
```
console.log(1)
```

编译后的文件：
```
webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


console.log(1);

/***/ })
],[0]);
//# sourceMappingURL=index.min.js.map
```

并且生成一个`.map`的文件：
```
{
  "version": 3,
  "file": "js/index.min.js",
  "sources": [
    "webpack:///src/public/js/index.js"
  ],
  "sourcesContent": [
    "console.log(1)\n\n\n// WEBPACK FOOTER //\n// src/public/js/index.js"
  ],
  "mappings": ";;;;;;;AAAA;;;A",
  "sourceRoot": ""
}
```
生成一个`.map`后缀文件，里面有相关配置信息

### hidden-source-map
源文件：
```
console.log(1)
```

编译后的文件：
```
webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


console.log(1);

/***/ })
],[0]);
```

并且生成一个`.map`后缀文件：
```
{
  "version": 3,
  "sources": [
    "webpack:///./src/public/js/index.js"
  ],
  "names": [
    "console",
    "log"
  ],
  "mappings": ";;;;;;;AAAAA,QAAQC,GAAR,CAAY,CAAZ,E",
  "file": "js/index.min.js",
  "sourcesContent": [
    "console.log(1)\n\n\n// WEBPACK FOOTER //\n// ./src/public/js/index.js"
  ],
  "sourceRoot": ""
}
```
和`source-map`一样，生成一个`.map`后缀文件，但不会在编译后的文件末尾追加注释


### inline-source-map
源文件：
```
console.log(1)
```

编译后的文件：
```
webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


console.log(1);

/***/ })
],[0]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcHVibGljL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQUEsUUFBUUMsR0FBUixDQUFZLENBQVosRSIsImZpbGUiOiJqcy9pbmRleC5taW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zb2xlLmxvZygxKVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wdWJsaWMvanMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9
```
可以看到末尾的注释`sourceMap`作为`DataURL`的形式被内嵌进了编译后文件中，由于`sourceMap`的所有信息都被加到了编译文件中，整个编译文件变得硕大无比

### eval-source-map
源文件：
```
console.log(1)
```

编译后的文件：
```
webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconsole.log(1);\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcHVibGljL2pzL2luZGV4LmpzPzc0MDYiXSwibmFtZXMiOlsiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsR0FBUixDQUFZLENBQVoiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnNvbGUubG9nKDEpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3B1YmxpYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ })
],[0]);
```
和`eval`类似，但是把注释里的`sourceMap`都转为了`DataURL`

### cheap-source-map
源文件：
```
console.log(1)
```

编译后的文件：
```
webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


console.log(1);

/***/ })
],[0]);
//# sourceMappingURL=index.min.js.map
```
并且生成一个`.map`后缀文件
```
{
  "version": 3,
  "file": "js/index.min.js",
  "sources": [
    "webpack:///./src/public/js/index.js"
  ],
  "sourcesContent": [
    "\"use strict\";\n\nconsole.log(1);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/public/js/index.js\n// module id = 0\n// module chunks = 0"
  ],
  "mappings": ";;;;;AAAA;AACA;AACA;;;A",
  "sourceRoot": ""
}
```
和`source-map`生成结果差不多，也会生成`.map`后缀文件，`.map`后缀文件的配置信息比前者精简些

### cheap-module-source-map
源文件：
```
console.log(1)
```

编译后的文件：
```
webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


console.log(1);

/***/ })
],[0]);
//# sourceMappingURL=index.min.js.map
```

并且生成一个`.map`后缀文件：
```
{
  "version": 3,
  "file": "js/index.min.js",
  "sources": [
    "webpack:///src/public/js/index.js"
  ],
  "sourcesContent": [
    "console.log(1)\n\n\n// WEBPACK FOOTER //\n// src/public/js/index.js"
  ],
  "mappings": ";;;;;;;AAAA;;;A",
  "sourceRoot": ""
}
```
和`source-map`、`cheap-module-source-map`生成结果差不多，也会生成`.map`后缀文件，`.map`后缀文件的配置信息比前两者更精简

## 各模式效率对比图
[来自webpack文档](https://webpack.github.io/docs/configuration.html#devtool)

devtool | build speed | rebuild speed | production supported | quality
---|---|---|---|---|---
eval | +++ | +++ | no | generated code
cheap-eval-source-map | + | ++ | no | transformed code (lines only)
cheap-source-map | + | 0 | yes | transformed code (lines only)
cheap-module-eval-source-map | 0 | ++ | no | original source (lines only)
cheap-module-source-map | 0 | - | yes | original source (lines only)
eval-source-map | - | + | no | 	original source
source-map | - | - | yes | original source

## 如何选择
选择困难症又来了，该如何选择呢？

推荐使用：`cheap-module-source-map`；原因如下：
1. 提高`soureMap`生成的效率
2. `soureMap`文件配置信息更简化
3. 如果`soureMap`代码内联到编译文件，会奇大无比

## 脚手架更新
#### `webpack.config.js`更新的片段代码：
在开发环境中，配置错误调式功能

```
// ...

// 不同环境下的操作
if (VARIABLE.isProduction) {
    // ...
    
} else {

    // ...
    
    module.exports.devtool = "source-map";
}
```

### 完整配置文件
#### `webpack.config.js`完整文件代码：
```
const webpack = require("webpack"),
    VARIABLE = require("./webpack.variable"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    OpenBrowserPlugin = require('open-browser-webpack-plugin');

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

                // JS依赖配置项
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', "react", "stage-0"]
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
    resolve: VARIABLE.resolve,

    // 插件配置项
    plugins: [

        //定义全局变量
        new webpack.ProvidePlugin(VARIABLE.ProvidePlugin),

        // 生成html插件配置项
        new HtmlWebpackPlugin({
            title: VARIABLE.htmlPlugin.title,
            filename: VARIABLE.htmlPlugin.filename,
            template: VARIABLE.htmlPlugin.template,
            hash: true,
        }),

        // 提取公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: VARIABLE.CommonsChunkPlugin.name,
            filename: VARIABLE.CommonsChunkPlugin.filename,
            minChunks: VARIABLE.CommonsChunkPlugin.minChunks,
        }),
    ],

};

// 不同环境下的操作
if (VARIABLE.isProduction) {
    // 生产环境下的配置
    module.exports.module.rules.push({
        // Css依赖配置项
        test: /\.(scss|sass|css)$/,

        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [{
                loader: "css-loader",
            }, {
                loader: "postcss-loader",
                options: {
                    plugins: loader => [
                        require('autoprefixer')(),
                    ],
                }
            }, {
                loader: "sass-loader",
            }]
        })

    });


    module.exports.plugins = (module.exports.plugins || []).concat([

        // 提取css
        new ExtractTextPlugin(VARIABLE.output.css),
    ]);
} else {

    // 开发环境下的配置
    module.exports.devtool = "source-map";

    module.exports.module.rules.push({
        // Css依赖配置项
        test: /\.(scss|sass|css)$/,

        use: [{
            loader: "style-loader"

        }, {
            loader: "css-loader",
            options: {
                sourceMap: true
            }
        }, {
            loader: "sass-loader",
            options: {
                sourceMap: true
            }
        }]

    });

    module.exports.plugins = (module.exports.plugins || []).concat([

        // 热更新
        new webpack.HotModuleReplacementPlugin(),

        // 打开浏览器
        new OpenBrowserPlugin({
            url: `${VARIABLE.server.host + ":" +VARIABLE.server.post}`
        })
    ]);
}
```

#### 开发环境指令
```
npm run dev
```

#### 生产环境命令
```
npm run build
```