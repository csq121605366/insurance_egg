'use strict';
process.env.VUE_ENV = 'server';
require('egg').startCluster({
  baseDir: __dirname,
  workers: process.env.WORKERS || '2',
  port: process.env.PORT || '7001',
  title: 'insurance',
  daemon: true
});
