const merge = require('webpack-merge'); //合并webpack文件内容
const common = require('./webpack.base.conf.js');
const path = require('path');
const webpack = require('webpack')

module.exports = merge(common, {
    devtool: 'eval-source-map',
    mode: 'development',
    devServer: { // 开发服务器
        // 设置服务器从那个目录提供内容，默认当前
        // contentBase: path.join(__dirname, "..", 'dist'),
        //告知服务器，观察 devServer.contentBase 下的文件。
        //文件修改后，会触发一次完整的页面重载
        // watchContentBase: false,
        // contentBase: false,
        // //一切服务都启用gzip压缩
        compress: false,
        // // 刷新模式，false时启用iframe模式
        // inline: true,
        // //默认是 localhost。如果你希望服务器外部可访问设置'0.0.0.0'
        host: 'localhost',
        port: 8080, // 启动端口默认8080
        // hot: false, // 是否启动热模块替换,(启用下也会启用自动刷新)
        // hotOnly: false, // 仅启动自动刷新
        // proxy: {}, // 设置请求代理
        // open: true, // 启动后是否自动打开默认浏览器
        // //当出现编译器错误或警告时，在浏览器中显示全屏覆盖层,默认false
        overlay: true,
        // //允许浏览器使用本地 IP 打开。
        // useLocalIp: false,
    },
    output: { // 输出
        filename: 'js/[name].[hash].js', // 每次保存 hash 都变化
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    module: {
        rules: [{
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 5000,
                        name: "imgs/[name].[ext]",
                        // publicPath: '../'
                    }
                }, ]
            },
        ]
    },
    plugins: [
        // 使用DllReferencePlugin 插件来告诉webpack未用了哪些动态链接库
        new webpack.DllReferencePlugin({
            // 将描述vue动态链接库的文件引入
            // context: process.cwd(), // 与DllPlugin中的那个context保持一致
            /** 
                下面这个地址对应webpack.dll.config.js中生成的那个json文件的路径
                这样webpack打包时，会检测此文件中的映射，不会把存在映射的包打包进bundle.js
            **/
            manifest: require(path.join(__dirname, '..', 'dll', 'vendor-manifest.json')),
        })
    ]
})