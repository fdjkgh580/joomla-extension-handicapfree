const webpack = require('webpack'); 
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    // 監聽
    watch: true,
 
    // development (開發模式未壓縮) | production (產品模式可壓縮)
    mode: 'production',
    
    // 進入點，每個頁面使用一個 JS 檔
    entry: {
        index: './assets/src/javascript/index.js'
    },
    
    // 自動輸出位置，我們對應到 ./assets/dist/[檔名].js
    output: {
        path: path.resolve(__dirname, 'assets/dist'), // JS 輸出點路徑
        filename: '[name].js'
    },

    // devtool: 'source-map',

    // 讓 jQuery 可以在不同的文件使用
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        // new UglifyJSPlugin({
        //     sourceMap: true
        // })
    ],
 
    // 優化設置
    optimization: {
 
        // 分離區塊
        splitChunks: {
            chunks: 'initial',
            cacheGroups: {
 
                // 將 import 路徑出現 "\node_modules\" 或 "\md\global\" 或 "\scss\" 底下的共用程式碼
                // 分離到 vendors.js
                vendors: {
                    test: /[\\/]node_modules[\\/]|[\\/]md[\\/]global[\\/]|[\\/]scss[\\/]/,
                    name: "vendors",
                }
            }
        }
    },
    
    // SUSY SASS 相關設置
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader", // compiles Sass to CSS
                options: {
                    includePaths: ["./assets/src/scss"] // 指定讀取的位置
                }
            }]
        }]
    }
};