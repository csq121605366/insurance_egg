"use strict";

const BaseController = require("./base");

class HospitalController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }
  //获取城市列表
  async getCitys() {
    try {
      let citys = await this.ctx.model.Hospital.find().select('_id city').exec();
      this.success(citys);
    } catch (e) {
      this.error('查找城市出错')
    }
  }
  //根据城市返回医院列表
  async getHospitals() {
    let { _id } = this.ctx.query;
    console.log(_id)
    try {
      let hospitals = await this.ctx.model.Hospital.findOne({ _id }).select('children.label children._id');
      this.success(hospitals.children)
    } catch (e) {
      this.error()
    }
  }

}

module.exports = HospitalController;
