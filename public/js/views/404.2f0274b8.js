!function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/public/",n(n.s="kds/")}({"8SS1":function(t,e,n){"use strict";n.r(e);var i=n("V6HT"),r=n.n(i),s=n("M8Iy"),a=n.n(s),o={data:function(){return{img_404:r.a,img_404_cloud:a.a}},computed:{message:function(){return"特朗普说这个页面你不能进......"}}},c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{background:"#f0f2f5","margin-top":"-20px"}},[n("div",{staticClass:"wscn-http404"},[n("div",{staticClass:"pic-404"},[n("img",{staticClass:"pic-404__parent",attrs:{src:t.img_404,alt:"404"}}),t._v(" "),n("img",{staticClass:"pic-404__child left",attrs:{src:t.img_404_cloud,alt:"404"}}),t._v(" "),n("img",{staticClass:"pic-404__child mid",attrs:{src:t.img_404_cloud,alt:"404"}}),t._v(" "),n("img",{staticClass:"pic-404__child right",attrs:{src:t.img_404_cloud,alt:"404"}})]),t._v(" "),n("div",{staticClass:"bullshit"},[n("div",{staticClass:"bullshit__oops"},[t._v("OOPS!")]),t._v(" "),t._m(0),t._v(" "),n("div",{staticClass:"bullshit__headline"},[t._v(t._s(t.message))]),t._v(" "),n("div",{staticClass:"bullshit__info"},[t._v("请检查您输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告")]),t._v(" "),n("a",{staticClass:"bullshit__return-home",attrs:{href:"/"}},[t._v("返回首页")])])])])};c._withStripped=!0;var l=n("JFUb"),_=!1;var u=function(t){_||n("i8Pl")},f=Object(l.a)(o,c,[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"bullshit__info"},[this._v("版权所有"),e("a",{staticClass:"link-type",attrs:{href:"https://wallstreetcn.com",target:"_blank"}},[this._v("华尔街见闻")])])}],!1,u,"data-v-3bca6aa9",null);f.options.__file="app\\web\\views\\404.vue";e.default=f.exports},"8wy/":function(t,e){t.exports=vendor},JFUb:function(t,e,n){"use strict";function i(t,e,n,i,r,s,a,o){var c=typeof(t=t||{}).default;"object"!==c&&"function"!==c||(t=t.default);var l,_="function"==typeof t?t.options:t;if(e&&(_.render=e,_.staticRenderFns=n,_._compiled=!0),i&&(_.functional=!0),s&&(_._scopeId=s),a?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),r&&r.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},_._ssrRegister=l):r&&(l=o?function(){r.call(this,this.$root.$options.shadowRoot)}:r),l)if(_.functional){_._injectStyles=l;var u=_.render;_.render=function(t,e){return l.call(e),u(t,e)}}else{var f=_.beforeCreate;_.beforeCreate=f?[].concat(f,l):[l]}return{exports:t,options:_}}n.d(e,"a",function(){return i})},M8Iy:function(t,e,n){t.exports=n.p+"img/404_cloud.0f4bc32b.png"},V6HT:function(t,e,n){t.exports=n.p+"img/404.a57b6f31.png"},XuX8:function(t,e,n){t.exports=n("8wy/")("XuX8")},"fcQ+":function(t,e,n){"use strict";var i=n("XuX8"),r=n.n(i),s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t};e.a=function(t){if(t.store){var e=s({},t.store.state,window.__INITIAL_STATE__);t.store.replaceState(e||{})}else window.__INITIAL_STATE__&&(t.data=s(window.__INITIAL_STATE__,t.data&&t.data()));new r.a(t).$mount("#app")}},i8Pl:function(t,e){},"kds/":function(t,e,n){"use strict";n.r(e);var i=n("fcQ+"),r=n("8SS1"),s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t};e.default=Object(i.a)(s({},r.default))}});