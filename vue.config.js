// const path = require('path')

// const resolve = dir => {
//   return path.join(__dirname, dir)
// }

module.exports = {
    // publicPath: './',
    devServer: {
        // lintOnSave:false,
        // chainWebpack:config =>{
        //     config.module
        //         .rule('swf')
        //         .test(/\.swf$/)
        //         .use('url-loader')
        //         .loader('url-loader')
        //         .options({
        //             limit:10000
        //         })    
        // },
        // proxy: {
        //     '/api': {
        //         target: 'http://120.79.28.58/', //对应自己的接口
        //         changeOrigin: true,
        //         ws: true,
        //         pathRewrite: {
        //           '^/api': ''
        //         }
        //     }
        // },
        // publicPath:"/"
    },
    // entry: path.join(__dirname, './src/app.jsx'),
    // output: {
    // path: path.join(__dirname, 'dist'),
    // filename: '[name].js',
    // publicPath: '/'
    // }

}