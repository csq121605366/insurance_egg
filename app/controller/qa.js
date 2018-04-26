
'use strict';

const BaseController = require('./base');

class QaController extends BaseController {


  /**
   * 创建问题
   */
  async qaCreate() {
    this.ctx.validate({
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
        required: false,
        allowEmpty: true
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
    if (info.images && info.images.length) {
      //转移治疗信息的图片
      await this.service.qiniu
        .removeImage(info.images)
        .then(res => {
          info.images = res;
        })
        .catch(() => {
          ctx.throw(403, "问题资料上传失败");
        });
    }
    let newOne = new this.ctx.model.Qa({
      user_id: this.app.mongoose.Types.ObjectId(_id),
      title: info.title,
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

  async qaAnswer() {
    this.ctx.validate({
      qa_id: {
        type: 'string'
      },
      images: {
        type: 'array',
        required: false
      },
      content: "string"
    });
    let info = this.ctx.request.body;
    let { role, status, _id } = this.ctx.state.user;
    if (info.images && info.images.length) {
      //转移治疗信息的图片
      await this.service.qiniu
        .removeImage(info.images)
        .then(res => {
          info.images = res;
        })
        .catch(() => {
          ctx.throw(403, "问题资料上传失败");
        });
    }
    let find = await this.ctx.model.User.findOne({ _id });
    let newOne = {
      user_id: find._id,
      name: find.name,
      phone: find.phone,
      role: find.role,
      hospital: find.hospital,
      department: find.department,
      title: find.title,
      gender: find.gender,
      avatar: find.avatar,
      avatarUrl: find.avatarUrl,
      content: info.content,
      images: info.images
    };
    try {
      await this.ctx.model.Qa.findOneAndUpdate({ _id: info.qa_id }, { $push: newOne }).exec();
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
    let { limit, user_id, last_id, key, type } = this.ctx.request.body;
    let { department } = await this.ctx.model.User.findOne({ _id });
    let find;
    let departmentList = [];
    department.forEach(element => {
      departmentList.push(element.key);
    });
    find = await this.service.qa.search({ limit, user_id, departmentList, last_id, key });
    this.success(find);
  }

  async qaDetail() {
    this.ctx.validate({
      qa_id: 'string'
    });
    let { qa_id } = this.ctx.request.body;
    let find = await this.ctx.model.Qa.findOne({ _id: qa_id }).populate({ path: 'qa_id', populate: { path: 'user_id', select: 'name hospital title avatar avatarUrl' } }).exec();
    this.success(find)
  }

}

module.exports = QaController;
