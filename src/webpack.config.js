const path = require('path')
const HtmlWepackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //将css代码提取为独立文件的插件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //CSS模块资源优化插件
const ClearWebpackPlugin = require('clean-webpack-plugin'); //清除dist文件夹下的文件

module.exports = {
    //入口文件
    // mode: 'development',
    entry: {
        home: './src/index.js',
        // about: './src/about.js',
        // list: './src/list.js'
    },
    //输出到dist文件夹
    output: {
        filename: '[name]-[hash].build.js', //修改输出的js文件格式：hash,name
        path: path.resolve(__dirname, './dist')
    },
    module: {
        // 配置loader插件
        rules: [{
                test: /\.(sa|sc|c)ss$/,
                exclude: /node_modules/, //排除node_modules文件夹
                use: [{
                    loader: MiniCssExtractPlugin.loader //建议生产环境采用此方式解耦css文件与js文件
                }, {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2, //指定css-loader处理前最多可以经过的loader个数  
                    }
                }, {
                    loader: 'postcss-loader' //承载autoprefixer功能
                }, {
                    loader: 'sass-loader' //SCSS加载器，webpack默认使用node-sass进行编译
                }]
            }, {
                test: /\.vue$/,
                use: [MiniCssExtractPlugin.loader, 'vue-loader']
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true,
                    loaders: {
                        css: [
                            'vue-style-loader',
                            MiniCssExtractPlugin.loader,
                            'css-loader'
                        ],
                        styl: [
                            'vue-style-loader',
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            'sass-loader'
                        ]
                    },
                    postLoaders: {
                        html: 'babel-loader'
                    }
                }
            },
        ]
    },
    // 插件
    plugins: [
        new HtmlWepackPlugin({
            title: '博客园首页',
            filename: 'index.html', //生成的html文件的文件名
            template: './index.html', //模版文件路径
            inject: 'true', //script插入位置
            // templateParameters: {
            //     param1: 'tony',
            //     param2: 'banner',
            // },//传递的参数
            cache: true, //只有文件修改了才会生成一个新的文件
            hash: true, //给生成的js文件尾部添加一个hash值
            minify: {
                removeComments: true, //移除注释
                collapseWhitespace: true, //压缩document中空白文本节点
                collapseInlineTagWhitespace: true, //压缩行级元素的空白，会保留&nbsp;实体空格
            },
            chunks: ['main', 'index']
        }),
        // new HtmlWepackPlugin({
        //     template: './index.html',
        //     title: '列表页',
        //     filename: 'list.html',
        //     inject: true,
        //     templateParameters: {
        //         param1: 'tony',
        //         param2: 'banner',
        //     },
        //     chunks: ['main', 'list']
        // }),
        // new HtmlWepackPlugin({
        //     template: './index.html',
        //     title: '关于页',
        //     filename: 'about.html',
        //     templateParameters: {
        //         param1: 'tony',
        //         param2: 'banner',
        //     },
        //     inject: true,
        //     chunks: ['main', 'about']
        // }),
        new ClearWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
            // chunkFilename: 'css/app.[contenthash:12].css'
        }), //为抽取出独立的css文件设置配置参数
        new VueLoaderPlugin()
    ],
    optimization: {
        minimizer: [new OptimizeCssAssetsPlugin()]
            //对生成的CSS文件进行代码压缩 mode='production'时生效
    }
}