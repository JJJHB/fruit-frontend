module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8082/fruit-backend',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}