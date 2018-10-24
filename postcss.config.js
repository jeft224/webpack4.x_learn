//允许你使用未来的 CSS 特性。
const postcssPresetEnv = require('postcss-preset-env');
// 自动添加浏览器前缀
const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        postcssPresetEnv,
        autoprefixer({
            // 配置要兼容的浏览器版本
            // 也可以在package.json中的browserslist字段中添加浏览器版本
            "browsers": [
                "defaults",
                "not ie < 11",
                "last 100 versions",
                "> 1%",
                "iOS 7",
                "last 3 iOS versions"
            ]
        }) // 自动添加浏览器前缀
    ]
}