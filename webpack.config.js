module.exports = {
  egg: true,
  framework: "vue", // 使用 easywebpack-vue 构建解决方案
  entry: {
    include: ["app/web"], // 自动遍历 app/web 目录下的 js 文件入口
    exclude: ["app/web/components"],
    loader: {
      client: "app/web/framework/entry/client-loader.js",
      server: "app/web/framework/entry/server-loader.js"
    }
  },
  alias: {
    "~": __dirname,
    "@": "app/web",
    server: "app/web/framework/entry/server.js",
    client: "app/web/framework/entry/client.js"
  },
  dll: ["vue/dist/vue.common.js", "axios", "vue", "vuex", "vuex-router-sync"], // webpack dll 构建
  install: {
    npm: "npm", // 默认是 npm, 可以是 cnpm
    check: false // 默认为禁用，自动安装缺少的 loader 和 plugin，建议首次 运行成功后，改成 false，加快构建速度
  },
  loaders: {
    eslint: false,
    scss: true
  },
  plugins: {
    serviceworker: false
  },
  done() {
    // 编译完成回调
  }
};
