// app/service/user.js
const BaseService = require("./base");

class DepartService extends BaseService {
  constructor(params) {
    super(params);
  }
  // 展示列表所有父节点
  async parentList() {
    try {
      return await this.ctx.model.Department.find()
        .select("key label")
        .exec();
    } catch (e) {
      throw new Error();
    }
  }

  // 查询父节点下的子节点列表
  async childrenList(key) {
    try {
      return await this.ctx.model.Department.findOne({ key })
        .select("children")
        .exec();
    } catch (e) {
      throw new Error();
    }
  }

  // 查询父节点下的子节点
  async children(parentKey, childrenKey) {
    try {
      return await this.ctx.model.Department.aggregate([
        { $match: { key: parentKey } },
        { $project: { key: 1, label: 1, children: 1 } },
        { $unwind: "$children" },
        { $match: { "children.key": childrenKey } }
      ]).exec();
    } catch (e) {
      throw new Error();
    }
  }
}

module.exports = DepartService;
