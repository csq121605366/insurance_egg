
'use strict';

const BaseController = require('./base');

class QaController extends BaseController {


  /**
   * 创建问题
   */
  async qaCreate() {
    this.ctx.validate({
      qa_id: {
        type: 'string',
        required: false
      },
      title: {
        type: 'string',
        required: false
      },
      department: {
        type: "object",
        required: false
      },
      illness_name: {
        type: "string",
        required: false
      },
      operation: {
        type: "string",
        required: false
      },
      images: {
        type: 'array',
        required: false
      },
      content: "string"
    });
    let info = this.ctx.request.body;
    let { role, status, _id } = this.ctx.state.user;
    if (role == '1') {
      info.type = '1'; //类型为问题
    } else {
      //查看帐号状态
      if (status != '2') return this.error("帐号未激活或已被锁定");
      //如果不存在问题id就报错
      if ((role == '2' || role == '3') && !qa_id) {
        return this.error('参数不正确')
      }
      info.type = '2'; //回答类型
    }
    if (info.images && info.images.length) {
      //转移治疗信息的图片
      await this.service.qiniu
        .removeImage(info.images)
        .then(res => {
          info.images = res;
        })
        .catch(() => {
          throw new Error("问题资料上传失败");
        });
    }
    let newOne = new this.ctx.model.Qa({
      user_id: this.app.mongoose.Types.ObjectId(_id),
      title: info.title,
      type: info.type,
      // qa_id: { $addToSet: this.app.mongoose.Types.ObjectId(qa_id) },
      department: info.department,
      illness_name: info.illness_name,
      operation: info.operation,
      images: info.images,
      content: info.content
    });
    try {
      await newOne.save();
      return this.success()
    } catch (e) {
      return this.error()
    }
  }

  async qaList() {
    this.ctx.validate({
      limit: {
        type: 'string',
        required: false
      },
      user_id: {
        type: 'string',
        required: false
      },
      last_id: {
        type: 'string',
        required: false
      },
      key: {
        type: 'string',
        required: false,
        allowEmpty: true
      }
    })
    let { _id, role } = this.ctx.state.user;
    let { limit, user_id, last_id, key } = this.ctx.request.body;
    if (user_id && _id !== user_id) return this.error('没有权限');
    let find = await this.service.qa.search({ limit, user_id, last_id, key });
    this.success(find);
  }


}

module.exports = QaController;
