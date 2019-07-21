## 前言
虽然可以通过`resolve.alias`配置别名达到简写效果，但是使用的时候得需要`require(xxx);`，嫌麻烦？没关系，webpack插件中内置了`webpack.ProvidePlugin`插件——全局挂载，便可省略这一步

其实也就是，通过设置自定义的字段，在使用的时候，可以直接使用该变量，无需再`require`

## 使用
```
module.exports = {
    plugins: [
        //全局挂载
        new webpack.ProvidePlugin({
            $: 'jquery',
        }),
    ],
    resolve:{
        //配置别名
        alias: {
            jquery: path.resolve(__dirname, "node_modules/jquery/dist/jquery.js"),
        }
    },
};
```
`resolve.alias`配置了别名，所以在`ProvidePlugin`中可以直接使用`resolve.alias`定义的字段名，如果没有在`resolve.alias`配置别名，则需要这么写
```
module.exports = {
    plugins: [
        //全局挂载
        new webpack.ProvidePlugin({
            $: path.resolve(__dirname, "node_modules/jquery/dist/jquery.js"),
        }),
    ],
};
```

## 脚手架更新
#### `src/index.js`更新的片段代码：
```
console.log(React, ReactDOM, PropTypes)
```

#### `webpack.variable.js`更新的片段代码：
定义全局挂载变量对象供配置文件调用
```
// ...

/**
 * 定义全局挂载变量
 * @type {object}
 */
VARIABLE.ProvidePlugin = {
    React: "React",
    ReactDOM: "ReactDom",
    PropTypes: "PropTypes",
};
```

#### `webpack.config.js`更新的片段代码：
调用`webpack.variable.js`文件中定义的`VARIABLE.ProvidePlugin`字段
```
module.exports = {
    // ...
    
    plugins: [
        // ...
        
        //定义全局变量
        new webpack.ProvidePlugin(VARIABLE.ProvidePlugin),
    ],
};
```

### 完整配置文件

#### `webpack.variable.js`完整文件代码：
```
/**
 * Webpack配置变量文件
 * @author  丘宇文
 * @QQ      80232265
 */
const path = require("path"),
    VARIABLE = {};

/**
 * 获取path函数
 * @param src 根目录下的子文件路径
 */
VARIABLE.getPath = (src = "") => path.resolve(__dirname, src);

/**
 * 是否为生产环境
 * @type    {boolean}
 * @default false
 */
VARIABLE.isProduction = process.env.NODE_ENV === 'production' ? true : false;

/**
 * 构建文件目录
 * @type {string}
 * @desc 开发环境下，构建目录为dev，反之为build
 */
VARIABLE.buildDir = VARIABLE.isProduction ? "./build" : "./dev";

/**
 * 入口文件路径配置
 * @type {string | array | object}
 */
VARIABLE.entry = [
     VARIABLE.getPath("src/index"),
 ],;

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
    publicPath: VARIABLE.isProduction ? "./" : "/",
    css: `dist/css/[name]${VARIABLE.isProduction ? ".min" : ""}.css`,
    filename: `dist/js/[name]${VARIABLE.isProduction ? ".min" : ""}.js`,
    fonts: "dist/fonts/[name].[ext]",
    media: "dist/media/[name].[ext]",
    img: "dist/img/[name].[ext]",
};

/**
 * html插件配置
 * @type {{title: string, filename, template}}
 * @prop title      html中的title标签内容
 * @prop filename   构建后生成文件规则
 * @prop template   html模版文件
 */
VARIABLE.htmlPlugin = {
    title: "",
    filename: VARIABLE.getPath(VARIABLE.buildDir + "/index.html"),
    template: VARIABLE.getPath("src/index.html"),
};

/**
 * 模版解析方式
 * @type {object}
 */
VARIABLE.resolve = {
    alias: {     // 定义别名
        React: VARIABLE.getPath("node_modules/react"),
        ReactDom: VARIABLE.getPath("node_modules/react-dom"),
        PropTypes: VARIABLE.getPath("node_modules/prop-types"),
    },
    modules: [   // 模版解析查找文件夹
        VARIABLE.getPath("src"),
        "node_modules"
    ],
};

/**
 * 定义全局挂载变量
 * @type {object}
 */
VARIABLE.ProvidePlugin = {
    React: "React",
    ReactDOM: "ReactDom",
    PropTypes: "PropTypes",
};

/**
 * 服务器配置
 * @type {{post: number, host: string}}
 * @prop post      端口号
 * @prop host      主机地址
 */
VARIABLE.server = {
    post: 8080,
    host: "http://127.0.0.1",
};

module.exports = VARIABLE;
```

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

#### 开发环境指令
```
npm run dev
```

#### 生产环境命令
```
npm run build
```