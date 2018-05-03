
'use strict';

const BaseController = require('./base');

class CommonController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.reg = this.config.regexp;
  }

  //发送验证码
  async sendcode() {
    this.ctx.validate({
      phone:{type:'string',format:this.reg.phone},
      type:{type:'enum',values:['bind','login','forgot','unbind']}
    });
    let {phone,type} = this.ctx.request.body;
    let sendType;
    
    if(type=='bind'){
      sendType = 71356;
    }else if(type=='login') {
      sendType = 71358;
    }else if(type=="forgot") {
      sendType = 71357;
    }else if(type=='unbind') {
     sendType = 71545;
    }else {
      return this.error('类型错误')
    }
    // 检验是否可以发送验证码
    // let cansend = await this.service.sms.canSendCode(phone,sendType);
    // if(!cansend) return this.error('验证码已发送,请注意查收');
    await this.service.sms.sendPhoneCode(phone,sendType);
    this.success('发送成功');
  }



} 

module.exports = CommonController;
