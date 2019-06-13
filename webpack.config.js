const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 第三方插件数组
const VENDOR = ["./src/vendor/jquery"];

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    entry: {
        main: './src/index.js',
        vendor: VENDOR
    },
    output: {
        // publicPath: resolve('assets'), // js 引用路径也可能是 cdn
        filename: '[name].js',
        path: resolve('dist')
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: resolve('dist'),
        port: 9527,
        host: "0.0.0.0", // 服务器外部可访问
        noInfo: true, // [启动时和每次保存之后，那些显示的 webpack 包(bundle)信息」的消息将被隐藏
        overlay: { // 显示编译错误
            warnings: false,
            errors: true
        },
        // publicPath: "http://localhost:9527/assets/",
        compress: true, // 开启 gzip 压缩
        proxy: { // 请求到 /test 现在会被代理到请求 https://easy-mock.com/mock/5cff9ebf4c9ace76ebeb8589/name/name。
            "/test": "https://easy-mock.com/mock/5cff9ebf4c9ace76ebeb8589/name/name"
        }
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // only package third parties that are initially dependent
                },
                // utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
                //     chunks: 'initial',
                //     name: 'utils', // 任意命名
                //     minSize: 0 // 只要超出0字节就生成一个新包
                // }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader'
                }],
                exclude: /node_modules/,
            }, {
                test: /\.css$/,
                use: [
                    {
                        loader: 'file-loader'
                    }, {
                        loader: 'css-loader',
                        options: {
                            // minimize: true, // css代码压缩
                            modules: true, // 开启之后 避免全局类名污染
                        }
                    }, {
                        loader: 'postcss-loader'
                    }
                ],
                include: resolve('src'),
                exclude: /node_modules/
            }, {
                test: /\.scss$/,
                use: ['css-loader', 'sass-loader'],
                exclude: /node_modules/
            }
        ]
    },
    // 加 s 都是数组
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin()
    ],
};
