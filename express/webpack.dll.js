/**
 * Webpack Dll配置文件
 * @author  丘宇文
 * @QQ      80232265
 */
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
        // 删除构建文件
        new CleanWebpackPlugin(VARIABLE.buildDir),

        // dll文件打包
        new webpack.DllPlugin({
            context: VARIABLE.DllPlugin.context,
            path: VARIABLE.DllPlugin.path,
            name: VARIABLE.DllPlugin.name,
        }),

        // new webpack.optimize.UglifyJsPlugin(),

    ],
};
