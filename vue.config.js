const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true, // vue项目启动时自动打开浏览器
    proxy: {
      "/api": {
        target: "http://47.98.125.34:8080", //目标地址，一般是指后台服务器地址

        changeOrigin: true, //是否跨域
        pathRewrite: {
          // pathRewrite 的作用是把实际Request Url中的'/api'用""代替
          "^/api": "",
        },
      },
      "/plugins/css/pluginsCss.css": {
        target: "http://47.98.125.34",
        changeOrigin: true,
        pathRewrite: {
          "^/plugins/css/pluginsCss.css": "/plugins/css/pluginsCss.css",
        },
      },
      '/plugins/plugins.css': {
        target: 'http://47.98.125.34',
        changeOrigin: true,
        pathRewrite: {
          '^/plugins/plugins.css': '/plugins/plugins.css'
        }
      },
      '/assets/iconfont/iconfont.css': {
        target: 'http://47.98.125.34',
        changeOrigin: true,
        pathRewrite: {
          '^/assets/iconfont/iconfont.css': '/assets/iconfont/iconfont.css'
        }
      },
      '/plugins/js/plugin.js': {
        target: 'http://47.98.125.34',
        changeOrigin: true,
        pathRewrite: {
          '^/plugins/js/plugin.js': '/plugins/js/plugin.js'
        }
      },
      '/luckysheet.umd.js': {
        target: 'http://47.98.125.34',
        changeOrigin: true,
        pathRewrite: {
          '^/luckysheet.umd.js': '/luckysheet.umd.js'
        }
      },

    },
    // proxy: {
    //   "/api": {
    //     target: "http://127.0.0.1:8080", //目标地址，一般是指后台服务器地址
    //
    //     changeOrigin: true, //是否跨域
    //     pathRewrite: {
    //       // pathRewrite 的作用是把实际Request Url中的'/api'用""代替
    //       "^/api": "",
    //     },
    //   },
    //   "/plugins/css/pluginsCss.css": {
    //     target: "http://127.0.0.1",
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/plugins/css/pluginsCss.css": "/plugins/css/pluginsCss.css",
    //     },
    //   },
    //   '/plugins/plugins.css': {
    //     target: 'http://127.0.0.1',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/plugins/plugins.css': '/plugins/plugins.css'
    //     }
    //   },
    //   '/assets/iconfont/iconfont.css': {
    //     target: 'http://127.0.0.1',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/assets/iconfont/iconfont.css': '/assets/iconfont/iconfont.css'
    //     }
    //   },
    //   '/plugins/js/plugin.js': {
    //     target: 'http://127.0.0.1',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/plugins/js/plugin.js': '/plugins/js/plugin.js'
    //     }
    //   },
    //   '/luckysheet.umd.js': {
    //     target: 'http://127.0.0.1',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/luckysheet.umd.js': '/luckysheet.umd.js'
    //     }
    //   },
    //
    // },
  },
});
