## 前言
在开发的时候，可以不提取css文件出来，而在生产的时候，建议得把css文件提取出来了，并且进行生产环境的优化，例如压缩、GZIP打开、CSS3浏览器兼容前缀等

使用`extract-text-webpack-plugin`依赖可提取CSS文件（css默认打开进js文件中

## 安装
```
npm install extract-text-webpack-plugin --save-dev
```

## 配置项
- `use`：自定义依赖
- `fallback`：编译后用什么插件来提取css文件
- `publicfile`：用来覆盖项目路径,生成该css文件的文件路径
- `publicPath`：修改静态文件引用路径

## 使用
```
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("style.css"),
    ]
}
```

## 脚手架更新

#### `webpack.config.js`更新的片段代码：
配置生产环境下的提取css插件
```
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// ...

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
    
    // ...
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
    resolve: {},

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

#### 运行开发命令
```
npm run dev
```

#### 运行生产环境
```
npm run build
```
运行成功后，CSS文件将不再直接打包进JS文件中，而是独立文件夹存放
