// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081, // 你想要的端口
    open: true, // 启动后自动打开浏览器
    // host: '0.0.0.0', // 如果需要局域网访问可以取消注释
  }
})