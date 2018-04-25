"use strict";

const BaseController = require("./base");

class DepartmentController extends BaseController {
  //获取主科室列表
  async departmentMain() {
    let list = await this.ctx.model.Department.find()
      .select("label key")
      .exec();
    this.success(list);
  }
  // 获取次科室列表
  async departmentVice() {
    let { _id } = this.ctx.request.query;
    if (!_id) return this.error("缺少参数");
    let list = await this.ctx.model.Department.findOne({ _id })
      .select("children.label children.key")
      .exec();
    if (list) this.success(list.children);
    else this.error("未找到");
  }

  


}

module.exports = DepartmentController;
