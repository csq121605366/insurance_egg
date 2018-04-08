const getters = {
  sidebar: state => state.app.sidebar,
  token: state => {
    return state.user.token;
  },
  avatar: state => {
    console.log(state);
    return state.user.avatar;
  },
  name: state => state.user.name,
  role: state => state.user.role
};
export default getters;
