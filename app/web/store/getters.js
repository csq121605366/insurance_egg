const getters = {
  sidebar: state => state.app.sidebar,
  interval: state => state.app.interval,
  qiniuTicket: state => state.app.qiniuTicket,
  statusList: state => state.app.statusList,
  genderList: state => state.app.genderList,
  sortList: state => state.app.sortList,
  authType: state => state.app.authType,
  adminRoleList: state => state.app.adminRoleList,
  roleList: state => state.app.roleList,
  operationList: state => state.app.operationList,

  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  phone: state => state.user.phone
};
export default getters;
