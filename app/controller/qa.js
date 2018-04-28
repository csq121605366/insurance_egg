"use strict";

const BaseController = require("./base");

class QaController extends BaseController {
  /**
   * 创建问题
   */
  async qaCreate() {
    this.ctx.validate({
      title: {
        type: "string",
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
        type: "array",
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
      return this.success();
    } catch (e) {
      return this.error();
    }
  }

  async qaAnswer() {
    this.ctx.validate({
      qa_id: {
        type: "string"
      },
      images: {
        type: "array",
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
      images: info.images,
      type: "1"
    };
    try {
      await this.ctx.model.Qa.update(
        { _id: info.qa_id },
        { $push: { answer: newOne }, $inc: { answer_count: 1 } }
      ).exec();
      return this.success();
    } catch (e) {
      return this.error();
    }
  }

  async qaSearch() {
    this.ctx.validate({
      limit: {
        type: "number",
        required: false
      },
      last_id: {
        type: "string",
        required: false
      },
      key: {
        type: "string",
        required: false
      }
    });
    let { _id, role } = this.ctx.state.user;
    let { limit, user_id, last_id, key } = this.ctx.request.body;
    let finder = await this.ctx.model.User.findOne({ _id });
    if (!finder) return this.error('未找到用户')
    let res;
    let oFindParam = {};
    if (user_id) {
      this.ctx.validate({
        user_id: "string"
      });
      //如果指定user_id则表示 只查该用户问答
      //验证用户权限
      if (user_id != finder._id) this.ctx.throw(401, "没有权限");
      if (last_id) oFindParam._id = { $lt: last_id };
      //如果为医生和经理人则查找回答
      if (finder.role == "2" || finder.role == "3") {
        let findParam = Object.assign({}, oFindParam, {
          "answer.user_id": { $in: [finder._id] }
        });
        if (key) {
          //如果存在搜索则加上筛选
          Object.assign(findParam, { $text: { $search: key } });
        }
        res = await this.ctx.model.Qa.find(findParam)
          .select("title illness_name department answer_count content meta")
          .limit(limit ? limit | 0 : 10)
          .sort({ _id: -1 })
          .exec();
      } else {
        let findParam = Object.assign({}, oFindParam, {
          user_id: finder._id
        });
        if (key) {
          //如果存在搜索则加上筛选
          Object.assign(findParam, { $text: { $search: key } });
        }
        res = await this.ctx.model.Qa.find(findParam)
          .select("title illness_name department answer_count content meta")
          .limit(limit ? limit | 0 : 10)
          .sort({ _id: -1 })
          .exec();
      }
    } else {
      let departmentList = [];
      finder.department.forEach(element => {
        departmentList.push(element.key);
      });
      if (last_id) oFindParam._id = { $lt: last_id };
      //首先搜索问题
      let findParam = Object.assign({}, oFindParam, {
        "department.key": { $in: departmentList } //只能搜索跟自己相关的问题
      });
      if (key) {
        //如果存在搜索则加上筛选
        Object.assign(findParam, { $text: { $search: key } });
      }
      res = await this.ctx.model.Qa.find(findParam)
        .select("title illness_name department answer_count content meta")
        .limit(limit ? limit | 0 : 10)
        .sort({ _id: -1 })
        .exec();
    }
    this.success(res);
  }

  async qaDetail() {
    this.ctx.validate({
      qa_id: "string"
    });
    let { qa_id } = this.ctx.request.body;
    let find = await this.ctx.model.Qa.findOne({ _id: qa_id });
    this.success(find);
  }

  async qaHot() {
    let { role, _id } = this.ctx.state.user;
    let finder = await this.ctx.model.User.findOne({ _id }).exec();
    let departmentList = [];
    finder.department.forEach(element => {
      departmentList.push(element.key);
    });
    let findParam = {
      "department.key": { $in: departmentList }
    };

    let res = await this.ctx.model.Qa.find(findParam)
      .select("title illness_name department answer_count content meta")
      .sort({ _id: -1 })
      .exec();
    this.success(res);
  }
}

module.exports = QaController;
