// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//     transpileDependencies: true,
// })

const { defineConfig } = require('@vue/cli-service')
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
})
