## 前言
通过配置模版解析项，可以提升不少开发效率

## 配置项
Resolve下的字段有：
- `alias`(object)：对某个依赖/文件路径自定义别名，然后通过别名便可引入对应资源；例如使用`require("自定义别名")`获取
- `aliasFields`(string)：指定一个字段，例如浏览器，根据该规范进行解析。默认值:`aliasFields: ["browser"]`
- `descriptionFiles`(array)：依赖描述文件，配置文件将在目录中读取；默认：`descriptionFiles: ["package.json"]`
- `enforceExtension`(boolean)：是否强制使用扩展名；为true时，强制使用扩展名，为false时，解析文件的时候，会尝试匹配无扩展名的文件；默认：`enforceExtension: false`
- `enforceModuleExtension`(boolean)：为true时，强制使用模版后缀名，反之，在解析一个模块名时，也会尝试不匹配后缀名的模块；默认：`enforceExtension: false`
- `extensions`(array)：默认解析扩展路径，设置完成后再引入文件后可以节约后缀名；默认：`extensions: [".js", ".json"]`
- `mainFields`(array)：解析一个目录时,配置的文件将视为文件的入口文件
- `mainFiles`(array)：在解析目录时使用的文件名；默认：`mainFiles: ["index"]`
- `modules`(array)：设置解析器查找模块的目录；默认：`modules: ["node_modules"]`
- `unsafeCache`(regex/array/boolean)：使用不安全的模块缓存；默认：`unsafeCache: true`
- `plugins`：可使用其他模块解析插件，例如[directory-named-webpack-plugin](https://www.npmjs.com/package/directory-named-webpack-plugin)，`plugins: [new DirectoryNamedWebpackPlugin()]`
- `symlinks`(boolean)：是否解析符号拼接资源`symlinks: true`
- `cachePredicate`(function)：自定义是否应缓存请求的函数；对象通过路径和请求属性传递给函数；默认：`cachePredicate: function() { return true }`

其实别看有那么多配置，常用的，也就那么几项，剩下的都直接使用默认值就好啦

## 使用
例如使用react为例

#### 安装开发依赖
```
npm install --save-dev babel-preset-react babel-preset-stage-0
```

#### 安装生产依赖
```
npm install react react-dom
```

#### Webpack配置文件
```
const path = require("path");

module.exports = {
    // ...
    
    resolve: {
        // 定义别名
        alias: {
            React: path.resolve(__dirname, "node_modules/react/index.js"),
            ReactDOM: path.resolve(__dirname, "node_modules/react-dom/index.js"),
            PropTypes: path.resolve(__dirname, "node_modules/prop-types/index.js"),
        },

        // 模版解析查找文件夹
        modules: [
            VARIABLE.getPath("src"),
            "node_modules"
        ]
    },
}
```

#### 引用
在js文件中可通过别名引入相关资源
```
require('React')        // 等介于 require('/node_modules/react/index.js')
require('ReactDOM')     // 等介于 require('/node_modules/react-dom/index.js')
require('PropTypes')    // 等介于 require('/node_modules/prop-types/index.js')
```

## 脚手架更新

#### `src/index.js`更新的片段代码：
```
console.log(require("React"))
```

#### `webpack.variable.js`更新的片段代码：
定义模版解析方式对象供配置文件调用

```
// ...

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
```

#### `webpack.config.js`更新的片段代码：
调用`webpack.variable.js`文件中定义的`VARIABLE.resolve`字段

```
module.exports = {
    // ...
    
    // 模版解析配置项
    resolve: VARIABLE.resolve,
}
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
    resolve: VARIABLE.resolve,

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

#### 开发环境指令
```
npm run dev
```

#### 生产环境命令
```
npm run build
```