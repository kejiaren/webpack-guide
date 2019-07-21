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
VARIABLE.entry = {
    // 业务代码
    main: [
        VARIABLE.getPath("src/index"),
    ],

    // 第三方资源
    vendor: [
        "react",
        "react-dom",
        "prop-types",
    ],
};

/**
 * 输出文件路径配置
 * @type {{path, publicPath: string, css: string, filename: string, fonts: string, media: string, dllFilename: string}}
 * @prop path         构建的文件目录规则
 * @prop publicPath   资源引用的公共路径规则
 * @prop filename     构建后生成文件规则
 * @prop css          构建后的样式文件规则
 * @prop fonts        构建后的字体图标文件规则
 * @prop media        构建后成的媒体文件(视频/音频)规则
 * @prop dllFilename  DLL配置文件构建后生成文件规则
 */
VARIABLE.output = {
    path: VARIABLE.getPath(VARIABLE.buildDir),
    publicPath: VARIABLE.isProduction ? "./" : "/",
    css: `dist/css/[name]${VARIABLE.isProduction ? ".min" : ""}.css`,
    filename: `dist/js/[name]${VARIABLE.isProduction ? ".min" : ""}.js`,
    fonts: "dist/fonts/[name].[ext]",
    media: "dist/media/[name].[ext]",
    img: "dist/img/[name].[ext]",
    dllFilename: `./dist/vendor/js/main${VARIABLE.isProduction ? ".min" : ""}.js`,
};

/**
 * html插件配置
 * @type {{title: string, filename, template, dllJs: string}}
 * @prop title      html中的title标签内容
 * @prop filename   构建后生成文件规则
 * @prop template   html模版文件
 * @prop dllJs      构建后生成文件规则
 */
VARIABLE.htmlPlugin = {
    title: "",
    filename: VARIABLE.getPath(VARIABLE.buildDir + "/index.html"),
    template: VARIABLE.getPath("src/index.html"),
    dllJs: VARIABLE.output.dllFilename,
};

/**
 * 模版解析方式
 * @type {object}
 */
VARIABLE.resolve = {
    // 定义别名
    alias: {
        React: VARIABLE.getPath("node_modules/react/index.js"),
        ReactDom: VARIABLE.getPath("node_modules/react-dom/index.js"),
        PropTypes: VARIABLE.getPath("node_modules/prop-types/index.js"),
    },
    // 模版解析查找文件夹
    modules: [
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

/**
 * 提取公共代码
 * @type {{name: string, filename: string, minChunks: number}}
 * @prop name           公共代码的chunk命名
 * @prop filename       打包后生产的js文件
 * @prop minChunks      最少共用几次将会被提取
 */
VARIABLE.CommonsChunkPlugin = {
    name: 'commons',
    filename: VARIABLE.output.filename,
    minChunks: 2,
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

module.exports = VARIABLE;