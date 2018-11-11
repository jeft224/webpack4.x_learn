const path = require('path');
// 合并配置文件
const merge = require('webpack-merge');
const common = require('./webpack.base.conf.js');
//将css代码提取为独立文件的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 分离CSS插件
// 打包之前清除文件
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 用于压缩css
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 用于压缩js
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// 处理svg成雪碧图的插件
const SpriteLoaderPlugin = require("svg-sprite-loader");

const webpack = require('webpack')

module.exports = merge(common, {
    module: {
        rules: [{
                test: /\.(sa|sc|c)ss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '../'
                        }
                    },
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
                            name: '[path][name][hash:8].[ext]', // 将图片打包到了path目录下，并生成原图片名加8位hash值的图片名
                            outputPath: 'images/',
                            // 图片引入资源的共路径，发布线上时很有用
                            publicPath: 'assets/'
                        }
                    },
                    // 图片压缩
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            //   bypassOnDebug: true,
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            }
                        },
                    }, //图片编码，生成dataURl,减少http请求，转换成字符串
                    {
                        loader: 'url-loader',
                        options: {
                            // name 同flie-loader
                            name: '[path][name][hash:8].[ext]',
                            // 小于10000字节的转换为DataUrl格式
                            limit: 10000,
                            // 是否采用file-loader， 默认采用
                            // 还可以用responsive-loader等一些其他loader
                            fallback: 'file-loader',
                            // 设置要处理的MIME类型，
                            mimetype: 'image/png',
                        }
                    },
                    // svg插件处理成雪碧图
                    {
                        loader:'svg-sprite-loader',
                        options:{
                            extract: true,
                            spriteFilename: svgPath => `sprite${svgPath.substr(-4)}` //切割svg生成的文件名
                        }
                    },
                    'svg-fill-loader',
                    'svgo-loader'
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: 'css/[id].[hash].css'
        }),
        new CleanWebpackPlugin(['dist/*'], { //清除dist目录下为文件
            root: path.resolve(__dirname, '../')
        }),
        new SpriteLoaderPlugin({
            plainSprite: true, // 
            spriteAttrs: {
                id: 'my-custom-sprite-id'
            } // svg导入的属性
        })
    ],
    mode: 'production',
    output: {
        filename: 'js/[name].[contenthash].js', //contenthash 若文件内容无变化，则contenthash 名称不变
        path: path.resolve(__dirname, '../dist')
    },
    optimization: {
        // 分离chunks
        splitChunks: {
            chunks: 'all',
            minSize: 2000, //(默认是30000)：形成一个新代码块最小的体积
            //（默认是1）：在分割之前，这个代码块最小应该被引用的次数
            //（译注：保证代码块复用性，默认配置的策略是不需要多次引用也可以被分割）
            minChunks: 1, //最少被引用次数
            maxInitialRequests: 3, //（默认是3）：一个入口最大的并行请求数
            maxAsyncRequests: 5, //（默认是5）：按需加载时候最大的并行请求数。
            //  此选项允许您指定用于生成名称的分隔符 默认以~分割
            automaticNameDelimiter: '~',
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: "initial" // 只打包初始时依赖的第三方
                },
            }
        },
        minimizer: [
            // 压缩JS
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false, // 去除警告
                        drop_debugger: true, // 去除debugger
                        drop_console: true // 去除console.log
                    },
                },
                cache: true, // 开启缓存
                parallel: true, // 平行压缩
                sourceMap: false // set to true if you want JS source maps
            }),
            // 压缩css
            new OptimizeCSSAssetsPlugin({}),
            //使用DllReferencePlugin 插件来告诉webpack未用了哪些动态链接库
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
    },
});