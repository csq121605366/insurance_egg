import App from './app.vue';

import serverRender from '~/app/web/framework/vue/entry/server.js';
import clientRender from '~/app/web/framework/vue/entry/client.js';
export default EASY_ENV_IS_NODE ? serverRender({ ...App }) : clientRender({ ...App });