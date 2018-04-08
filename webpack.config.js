module.exports = {
  egg: true,
  framework: "vue", // 使用 easywebpack-vue 构建解决方案
  entry: {
    include: ["app/web/site"], // 自动遍历 app/web/site 目录下的 js 文件入口
    exclude: ["app/web/site/[a-z]+/component"],
    loader: {
      client: "app/web/framework/vue/entry/client-loader.js",
      server: "app/web/framework/vue/entry/server-loader.js"
    }
  },
  alias: {
    "~": __dirname,
    "@": "app/web/site/admin",
    web: "app/web",
    server: "app/web/framework/vue/entry/server.js",
    client: "app/web/framework/vue/entry/client.js",
    asset: "app/web/asset",
    component: "app/web/component",
    framework: "app/web/framework",
    store: "app/web/store",
    router: "app/web/router"
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
  plugins: {},
  done() {
    // 编译完成回调
  }
};
