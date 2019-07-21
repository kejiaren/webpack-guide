## 前言
当使用各种第三方资源(框架/库/组件...)的时候，会导致每次构建的时候，编译都要耗大量时间

webpack提供了`DllPlugin`、`DllReferencePlugin`，通过配置可以把公共代码和业务代码在编译的时候分离出来，从而节省打包公共代码所所耗时间

其实也就是，先把第三方资源先打包，后引用

## DllPlugin
此插件可以理解为分包（先打包第三方资源）

例如，当你使用第三方资源的时候，如：`jquery`、`vue`、`react`等，如果不把它们分离出来，那在业务代码中，每次修改的时候，都会被编译一次，也会因此打包而消耗更多的时间，特别是项目后期，卡的不要不要不要的

通过配置，把公共代码打包成一个js文件跟json配置文件，此json文件供打包业务代码配置中的`DllReferencePlugin`相关联

### 配置项
- `path`：打包文件的输出路径
- `name`：暴露的对象名，要跟 output.library 保持一致
- `context`：解析包路径的上下文，这个要跟业务代码打包配置一致，默认根目录

#### 使用
例如新建一个`webpack.dll.js`文件，此文件的配置跟`webpack.config.js`文件配置类型，毕竟使用第三方资源的时候，也有可能需要类似的处理
```
const webpack = require("webpack");

module.exports = {

	entry: ["react"],

	output: {
		path: path.join(__dirname, "js"),
		filename: "[name]_[hash].js",
		library: "[name]_[hash]"
	},

	plugins: [
		new webpack.DllPlugin({
			path: path.join(__dirname, "js", "manifest.json"),
			name: "[name]_[hash]"
		})
	]
};
```

## DllReferencePlugin
此插件作用在于跟`DllPlugin`插件做关联

可以理解为，利用`DllPlugin`把第三方资源先打包起来，然后再用`DllReferencePlugin`关联起来，供业务代码调用

### 配置项
- `context`：要跟`DllPlugin`配置中的`context`一致，用来指向Webpack匹配`json`配置文件中库的路径
- `manifest`：用来引入通过`DllPlugin`配置打包出来的json文件
- `scope`：可选，用于访问dll内容的前缀
- `name`：可选，dll暴露的名称,默认为`manifest.name`
- `sourceType`：可选，dll暴露的类型,默认为`var`
- `content`：从请求到模块ID的映射,默认为`manifest.content`

业务代码配置，例如`webpack.config.js`:
```
module: {
    plugins: [
        new DllReferencePlugin({
            context: __dirname,
            manifest: require("./js/manifest.json"),
        }),
    ]
}
```

然后可以视图页面引入`DllPlugin`打包出来的资源文件

## 脚手架更新
#### `webpack.variable.js`文件：
- 在输出配置对象中追加dll所需用的字段
- 在html插件对象里面追加dll所需用的字段
- DLL插件配置（webpack.dll.js）
- DLL关联插件配置（webpack.config.js）
```
// ...

VARIABLE.output = {
    // ....
    dllFilename: `./dist/vendor/js/main${VARIABLE.isProduction ? ".min" : ""}.js`, // 在输出配置对象中追加dll所需用的字段
};

VARIABLE.htmlPlugin = {
    // ....
    dllJs: VARIABLE.output.dllFilename,     // 在html插件对象里面追加dll所需用的字段
};

/**
 * DLL插件配置
 * @type {{context, path, name: string}}
 * @prop context    上下文
 * @prop path       打包后生产的js文件
 * @prop name       打包后生产的js文件
 */
VARIABLE.DllPlugin = {
    context: VARIABLE.getPath(),
    path: VARIABLE.getPath(`${VARIABLE.buildDir}/dist/vendor/manifest.json`),
    name: "[name]",
};

/**
 * DLL关联插件配置
 * @type {{context, manifest}}
 * @prop context    此上下文需要跟DllPlugin插件中的context字段值一样
 * @prop manifest   引入DllPlugin插件打包出来的json配置文件
 */
VARIABLE.DllReferencePlugin = {
    context: VARIABLE.DllPlugin.context,
    manifest: VARIABLE.DllPlugin.path,
};
```

#### `webpack.dll.js`文件：
- 配置dll插件
```
const webpack = require("webpack"),
    VARIABLE = require("./webpack.variable"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    //入口文件配置
    entry:  VARIABLE.entry.vendor,

    // 输出文件配置
    output: {
        path: VARIABLE.output.path,
        filename: VARIABLE.output.dllFilename,
        library: '[name]',
    },

    // 插件配置项
    plugins: [
        new CleanWebpackPlugin(VARIABLE.buildDir),

        // dll文件打包
        new webpack.DllPlugin({
            context: VARIABLE.DllPlugin.context,
            path: VARIABLE.DllPlugin.path,
            name: VARIABLE.DllPlugin.name,
        }),
    ],
};
```

#### `webpack.config.js`更新的片段代码：
- 配置DllReferencePlugin插件，与`webpack.dll.js`文件做关联
- HtmlWebpackPlugin插件添加一个字段，其字段值便是分包出来的第三方资源路径
```
// ...
module: {
    plugins: [
        // ...

        // 与webpack.dll.js打包出来的文件做关联
        new webpack.DllReferencePlugin({
            context: VARIABLE.DllReferencePlugin.context,
            manifest: require(VARIABLE.DllReferencePlugin.manifest),
        }),

        // 生成html插件配置项
        new HtmlWebpackPlugin({
            // ...
            dllJs: VARIABLE.htmlPlugin.dllJs,
        }),
    ]
}
```

#### `src/index.html`更新的片段代码：
- 手动引入dll分包出来的第三方资源
```
<!DOCTYPE html>
<html lang="cn">
<head>
    <meta charset="UTF-8">
    <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
    <div id="app"></div>
    <script src="<%= htmlWebpackPlugin.options.dllJs + '?' + new Date().getTime() %>"></script>
</body>
</html>
```

#### `package.json`文件更新片段的代码：
- 更新`scripts`字段，先分包再构建
```
{
    // ...
    "scripts": {
        "dev": "webpack --config webpack.dll.js --progress && webpack && node server.js",
        "build": "cross-env NODE_ENV=production webpack --config webpack.dll.js --progress -p && cross-env NODE_ENV=production webpack --progress -p"
    },
    // ...
}
```

### 完整配置文件

#### `webpack.dll.js`完整文件代码：
同上述相关代码

#### `webpack.config.js`完整文件代码：
```
const webpack = require("webpack"),
    VARIABLE = require("./webpack.variable"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    //入口文件配置项
    entry: VARIABLE.entry.main,

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

    // 插件配置项
    plugins: [
        // 与webpack.dll.js打包出来的文件做关联
        new webpack.DllReferencePlugin({
            context: VARIABLE.DllReferencePlugin.context,
            manifest: require(VARIABLE.DllReferencePlugin.manifest),
        }),

        //定义全局变量
        new webpack.ProvidePlugin(VARIABLE.ProvidePlugin),

        // 生成html插件配置项
        new HtmlWebpackPlugin({
            title: VARIABLE.htmlPlugin.title,
            filename: VARIABLE.htmlPlugin.filename,
            template: VARIABLE.htmlPlugin.template,
            hash: true,
            dllJs: VARIABLE.htmlPlugin.dllJs,
        }),

        // 提取公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: VARIABLE.CommonsChunkPlugin.name,
            filename: VARIABLE.CommonsChunkPlugin.filename,
            minChunks: VARIABLE.CommonsChunkPlugin.minChunks,
        }),
    ],

    resolve: VARIABLE.resolve,

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
        }),

        // 错误重启
        new webpack.NoEmitOnErrorsPlugin(),
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