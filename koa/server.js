const Koa = require('koa'),
    ServeStatic = require('koa-static'),
    config = require('./webpack.config'),
    webpack = require('webpack'),
    { devMiddleware, hotMiddleware } = require('koa-webpack-middleware'),
    {output, server, buildDir} = require("./webpack.variable"),
    app = new Koa();

const compiler = webpack(config);
config.entry.unshift("webpack-hot-middleware/client?reload=true");

app.use(devMiddleware(compiler, {
    noInfo: true,

    publicPath: output.publicPath,
}));

app.use(hotMiddleware(compiler, {
}));

app.use(ServeStatic(buildDir));

app.listen(server.post, () => {
    console.log(`服务器启动成功：${server.host + ":" + server.post}`)
});