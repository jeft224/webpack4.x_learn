const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path')
const { resolve } = require('path');
// html插件 生成入口文件 
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 使用 happypack 多进程加快编译速度
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
module.exports = {
    entry: './src/index.js', //入口文件
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader' //vue需要的vue解析loader
        }, {
            test: /\.js$/,
            //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
            use: ['happypack/loader?id=happyBabel', 'babel-loader'],
            //排除node_modules 目录下的文件
            exclude: /node_modules/
        }, ]
    },
    plugins: [
        // 解决vender后面的hash每次都改变
        new webpack.HashedModuleIdsPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../index.html'),
            inject: 'true', //script插入位置
            cache: true, //只有文件修改了才会生成一个新的文件
            hash: true, //给生成的js文件尾部添加一个hash值
            minify: {
                removeComments: true, //移除注释
                collapseWhitespace: true, //压缩document中空白文本节点
                collapseInlineTagWhitespace: true, //压缩行级元素的空白，会保留&nbsp;实体空格
                removeAttributeQuotes: true //压缩 去掉引号
            },
        }),
        new HappyPack({
            //用id来标识 happypack处理类文件
            id: 'happyBabel',
            //如何处理 用法和loader 的配置一样
            loaders: [{
                loader: 'babel-loader?cacheDirectory=true',
            }],
            //共享进程池
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
        }),
    ], // 插件
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        }
    }
}