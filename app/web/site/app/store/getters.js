const getters = {
  sidebar: state => state.app.sidebar,
  interval: state => state.app.interval,
  qiniuTicket: state => state.app.qiniuTicket,
  authType: state => state.app.authType,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  phone: state => state.user.phone
};
export default getters;
