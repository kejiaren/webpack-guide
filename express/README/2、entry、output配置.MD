## 前言
本文将讲解entry(入口文件配置项)、output(输出文件配置项)

## entry
入口文件配置项，可配置不同入口
- 单入口字符串类型，如：`entry: "xx.js"`
- 多入口数组类型，如：`entry: [..."xx.js"]`
- 多入口对象类型，如：`entry: {x: "xx.js"}`

单入口字符串类型
```
module.exports = {
    entry: path.resolve(__dirname, "index.js"),
};
```

多入口数组类型
```
module.exports = {
    entry: [path.resolve(__dirname, "index.js")]
};
```

多入口对象类型
```
module.exports = {
    entry: {
        index: path.resolve(__dirname, "index.js")
    },
};
```

## output
output为输出文件配置，其可选子项有
- `path`：生成文件的根目录，需要传入一个绝对路径
- `publicPath`：生成资源文件的共用路径，例如生成css、js、img、字体图标等
- `filename`：定义输出文件名规则
    - `[name]`：输出文件的name，如果entry的字段值是对象，那么，此name对应entry字段值的key
    - `[hash]`：编译时生成一个hash值，可以设置hash长度，例如：`[hash:n]`中的n就为hash的长度值
    - `[chunkhash]`：指向当前chunk的一个hash版本，也就是说，在同一次编译中，每一个chunk的hash都是不一样的；而在两次编译中，如果某个chunk根本没有发生变化，那么该chunk的hash也就不会发生变化。这在缓存的层面上来说，就是把缓存的粒度精细到具体某个chunk，只要chunk不变，该chunk的浏览器缓存就可以继续使用
- `chunkFilename`：与filename类似，都是用来定义生成文件的命名方式的，只不过，chunkFilename参数指定的是除入口文件外的chunk（这些chunk通常是由于webpack对代码的优化所形成的，比如因应实际运行的情况来异步加载）的命名

```
module.exports = {
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "js/[name].js",
        publicPath: "/",
    },
};

```

## 脚手架更新
#### `src/index.js`文件：
```
console.log(1);
```

#### `webpack.variable.js`文件：
```
const path = require("path"),
    VARIABLE = {};

/**
 * 获取path函数
 * @param src 根目录下的子文件路径
 */
VARIABLE.getPath = (src = "") => path.resolve(__dirname, src);

/**
 * 构建文件目录
 * @type {string}
 */
VARIABLE.buildDir = "./build";

/**
 * 入口文件路径配置
 * @type {string | array | object}
 */
VARIABLE.entry = [
    VARIABLE.getPath("src/index")
];

/**
 * 输出文件路径配置
 * @type {{path, publicPath: string, filename: string}}
 * @prop path         构建的文件目录规则
 * @prop publicPath   资源引用的公共路径规则
 * @prop filename     构建后生成文件规则
 */
VARIABLE.output = {
    path: VARIABLE.getPath(VARIABLE.buildDir),   
    filename: `dist/js/[name].js`,              
    publicPath: "/",
};

module.exports = VARIABLE;
```

#### `webpack.config.js`文件：
```
const webpack = require("webpack"),
    VARIABLE = require("./webpack.variable");
    
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

    },

    // 模版解析配置项
    resolve: {

    },

    // 插件配置项
    plugins: [

    ],

};
```

#### 运行webpack指令构建
```
webpack
```

根目录下会多一个`build`文件夹，其目录结构是这样的：

```
+wepackScaffold
    |-build                 
    |    |-dist       
    |    |    |-js   
    |            |-main.js
```