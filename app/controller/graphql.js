
const BaseController = require('./base');
const { graphiqlKoa } = require('graphql-server-koa');
class GraphqlController extends BaseController {
  async gi() {
    const { ctx } = this;
    await graphiqlKoa({ endpointURL: '/graphql' })(ctx, next)
    this.success('成功')
  }

}

module.exports = GraphqlController;