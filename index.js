'use strict';
const path = require('path');
// process.env.VUE_ENV = 'server';
process.env.EGG_SERVER_ENV = 'prod';
process.env.NODE_ENV = 'production';
require('egg').startCluster({
  baseDir: __dirname,
  workers: process.env.WORKERS || '2',
  port: process.env.PORT || '443',
  title: 'health_happy',
  https: true,
  key: path.join(__dirname, './cert/1526060713348.key'),
  cert: path.join(__dirname, './cert/1526060713348.pem'),
  daemon: true
});
