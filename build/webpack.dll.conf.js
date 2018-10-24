const webpack = require('webpack');
const path = require('path');

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        vendor: ['vue'],
    },

    output: {
        path: path.join(__dirname, '../dll'), // 生成的文件存放路径
        filename: '[name].dll.js', // 生成的文件名字(默认为vendor.dll.js)
        library: '[name]', // 生成文件的映射关系，与下面DllPlugin中配置对应
        libraryTarget: 'this'
    },

    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '../dll', '[name]-manifest.json'),
            name: '[name]', // 与上面output中library配置对应
            context: path.resolve(__dirname, '../') // 上下文环境路径（必填，为了与DllReferencePlugin存在与同一上下文中）
        }),
    ]
};