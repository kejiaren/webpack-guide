## 前言
Module配置项可以说是资源转换器，通过相关配置，可以在开发中使用预编译的语言，然后在需要的时候构建成符合实际的代码

例如使用CSS扩展语言SASS/LESS开发，通过`sass-loader`编译成CSS；使用ES6+开发，可以通过`babel-loader`编译成ES5的js代码

而这些操作，便只需安装相关依赖，然后在module对象下的`rules`字段进行相关配置

## Rules
`module.rules`字段值一般设置数组，然后每个下标为一个对象，需要增加依赖，只需追加即可，而每个下标（对象）可配置
- `test`：需要处理的资源文件（推荐使用正则匹配相关文件
- `exclude`：需要被忽略的文件资源（推荐使用正则匹配相关文件，可选
- `include`：设置需要被处理的资源文件目录（可选
- `loader`：设置依赖，依赖模块一般以```xxx-loader``` 的方式命名，多个依赖模块之间可以使用```!```做分隔，如 ```xxx-loader!xxx-loader```
- `query`：额外设置选项（可选

## 常用相关模版介绍
都说rules就是定义编译规则了，所以只需通过相关依赖，便可做相对应的事，下面将推荐几个常用依赖：
- html模版引擎：[pug-loader](https://www.npmjs.com/package/pug-loader)、[ejs-loader](https://www.npmjs.com/package/ejs-loader)等
- 处理样式：[css-loader](https://www.npmjs.com/package/css-loader)、[style-loader](https://www.npmjs.com/package/style-loader)、[less-loader](https://www.npmjs.com/package/less-loader)、[sass-loader](https://www.npmjs.com/package/sass-loader)、[autoprefixer](https://www.npmjs.com/package/autoprefixer)、[postcss-loader](https://www.npmjs.com/package/postcss-loader)等
- 图片/文件处理：[url-loader](https://www.npmjs.com/package/url-loader)、[file-loader](https://www.npmjs.com/package/file-loader)、[ webpack-spritesmith](https://www.npmjs.com/package/webpack-spritesmith)等
- js处理：[babel-loader](https://www.npmjs.com/package/babel-loader)、[babel-core](https://www.npmjs.com/package/babel-core)、[babel-preset-env](https://www.npmjs.com/package/babel-preset-env)等

更多依赖，可上[NPM官网](https://www.npmjs.com/)搜索

## 安装
```
npm install --save-dev css-loader style-loader sass-loader node-sass autoprefixer postcss-loader url-loader file-loader babel-loader babel-core babel-preset-env
```

**注意：node-sass依赖有很大可能安装不成功，因为镜像是国外的，所以你懂的；不过没关系，可以安装[淘宝NPM镜像](http://npm.taobao.org/)来安装**

## 淘宝NPM镜像
当安装依赖安装不成功的时候，可以先安装个[淘宝NPM镜像](http://npm.taobao.org/)，使用方法极其类似
```
npm install -g cnpm
```

### 安装依赖
使用淘宝NPM镜像安装命令跟NPM极其类似，一个npm，一个cnpm，其他相似
```
cnpm install [name]
```

## Js依赖配置
使用了`babel-loader`、`babel-core`、`babel-preset-env`依赖，可支持ES6+写法，最终编译出来的是ES5标准下的代码
```
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }
    ]
}
```

## Css依赖配置
使用了`css-loader`、`style-loader`、`sass-loader`、`postcss-loader`、`autoprefixer`依赖，可支持CSS/SASS/SCSS写法，并且自动添加CSS3浏览器前缀；最终编译出来的是CSS
```
module.exports = {
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.(scss|sass|css)$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader", options: {
                    sourceMap: true
                }
            }, {
                loader: "postcss-loader",
                options: {
                    plugins: loader => [
                        require('autoprefixer')(),
                    ],
                    sourceMap: true,
                }
            }, {
                loader: "sass-loader", options: {
                    sourceMap: true
                }
            }]
        }]
    }
};
```

## Img依赖配置
使用了`url-loader`依赖，通过设置`limit`字段，可把图片打包成base64格式图片，其单位为字节

```
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jp?g|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,        // 小于8192字节的图片打包成base 64图片
                        }
                    }
                ]
            }
        ]
    }
}
```
**注意：未打包或打包成的base64格式的图片不会再出现在构建目录下**

## 文件依赖配置
使用了`file-loader`依赖，可对相关文件进行打包

```
module.exports = {
    module: {
        rules: [
            // 字体图标
            {
                test: /\.(woff|woff2|svg|eot|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: "输出的路径",
                    },
                }],
                
            },{
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
    }
};
```

## 脚手架更新
如果未安装上面所需依赖包，那请执行下面安装命令，安装过，则直接跳过
```
npm install --save-dev css-loader style-loader sass-loader node-sass autoprefixer postcss-loader url-loader file-loader babel-loader babel-core babel-preset-env
```

#### `src/assets/style/index.css`文件更新片段的代码：
```
body {
    background: red;
}
```

#### `src/index.js`文件更新片段的代码：
```
import "./assets/style/index.css"
```


#### `webpack.variable.js`文件更新片段的代码：
- `output`字段新增构建资源文件路径配置
```
// ...
VARIABLE.output = {
    path: VARIABLE.getPath(VARIABLE.buildDir),
    filename: `dist/js/[name].js`,
    media: "dist/media/[name].[ext]",
    fonts: "dist/fonts/[name].[ext]",
    css: `dist/css/[name].css`,
    img: "dist/img/[name].[ext]",
    publicPath: "/",
};
// ...

```
#### `webpack.config.js`更新片段代码：
- 在`module.rules`字段中添加配置
```
// ...

module.exports = {
    // ...

    // 加载器模块
    module: {
        rules: [
            {
                test: /\.(scss|sass|css)$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "postcss-loader",
                    options: {
                        plugins: loader => [
                            require('autoprefixer')(),
                        ],
                        sourceMap: true,
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
            }, {

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
    
    // ...
};

```

### 完整配置文件

#### `webpack.variable.js`完整文件代码：
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
    VARIABLE.getPath("src/index.js")
];

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
    filename: `dist/js/[name].js`,            
    media: "dist/media/[name].[ext]",    
    fonts: "dist/fonts/[name].[ext]",  
    css: `dist/css/[name].css`,
    img: "dist/img/[name].[ext]",
    publicPath: "/",
};

module.exports = VARIABLE;
```

#### `webpack.config.js`完整文件代码：
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
        rules: [
            {
                test: /\.(scss|sass|css)$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "postcss-loader",
                    options: {
                        plugins: loader => [
                            require('autoprefixer')(),
                        ],
                        sourceMap: true,
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
            }, {

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

构建目录结构：
```
+wepackScaffold
    |-build              
    |    |-dist       
    |    |    |-js   
    |    |      |-index.js   
```    
此时，你会好奇，怎么只有js文件呢？

css样式直接被打包进了`build/dist/js/index.js`文件夹中

**注意：未引用的资源和打包成base64格式的图片是不会出现在构建目录中**


