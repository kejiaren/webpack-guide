const
    path = require("path"),
    express = require('express'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpack = require('webpack'),
    config = require('./webpack.config'),
    {output, server, buildDir} = require("./webpack.variable"),
    app = new express();

config.entry.unshift("webpack-hot-middleware/client?reload=true");
let compiler = webpack(config);

app
    .use(webpackDevMiddleware(compiler, {
        publicPath: output.publicPath,
        logLevel: "warn",
    }))
    .use(webpackHotMiddleware(compiler))
    .use(express.static(buildDir))
    .get('/*', (req, res) => res.sendFile(buildDir + '/index.html'))
    .listen(server.post, () => {
        console.log(`服务器启动成功：${server.host + ":" + server.post}`)
    });
