const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '2h', // 2小时间隔
      type: 'worker', // 指定一个的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    console.log('suscribe');
    // this.ctx.app.cache = res.data;
  }
}

module.exports = UpdateCache;