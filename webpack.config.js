module.exports = {
  egg: true,
  framework: 'vue', // 使用 easywebpack-vue 构建解决方案
  entry: {
    include: ['app/web/page'], // 自动遍历 app/web/page 目录下的 js 文件入口
    exclude: ['app/web/page/[a-z]+/component'],
  },
  alias: {
    "~": __dirname,
    asset: 'app/web/asset',
    component: 'app/web/component',
    framework: 'app/web/framework',
    store: 'app/web/store'
  },
  dll: ['vue/dist/vue.common.js', 'axios'], // webpack dll 构建
  install: {
    npm: 'npm', // 默认是 npm, 可以是 cnpm
    check: false // 默认为禁用，自动安装缺少的 loader 和 plugin，建议首次 运行成功后，改成 false，加快构建速度
  },
  loaders: {
    eslint: false
  },
  plugins: {},
  done() { // 编译完成回调
  }
};