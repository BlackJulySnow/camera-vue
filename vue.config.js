const { defineConfig } = require('@vue/cli-service')
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const isProduction = process.env.NODE_ENV !== 'development';
module.exports = defineConfig({
    transpileDependencies: true,
    filenameHashing: false,
    outputDir: "../src/main/resources/static",
    chainWebpack(config) {
        config.optimization.minimizer('terser').tap((args) => {
            args[0].terserOptions.compress.drop_console = true
            return args
        })
    },
    productionSourceMap:false,//取消打包map文件
    lintOnSave: false,
    // configureWebpack: config => {
    //     // 生产环境相关配置
    //     if (isProduction) {
    //       //gzip压缩
    //       const productionGzipExtensions = ['html', 'js', 'css']
    //       config.plugins.push(
    //           new CompressionWebpackPlugin({
    //               filename: '[path][base].gz',
    //               algorithm: 'gzip',
    //               test: new RegExp(
    //                   '\\.(' + productionGzipExtensions.join('|') + ')$'
    //               ),
    //               threshold: 10240, // 只有大小大于该值的资源会被处理 10240
    //               minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
    //               deleteOriginalAssets: false // 删除原文件
    //           })
    //       )
    //   }
    // }
})
