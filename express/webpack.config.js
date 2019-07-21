/**
 * Webpack配置文件
 * @author  丘宇文
 * @QQ      80232265
 */
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
        // new OpenBrowserPlugin({
        //     url: `${VARIABLE.server.host + ":" +VARIABLE.server.post}`
        // }),

        // 错误重启
        new webpack.NoEmitOnErrorsPlugin(),
    ]);
}