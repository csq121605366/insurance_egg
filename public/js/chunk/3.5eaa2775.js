(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"/vi4":function(e,t){},"9njm":function(e,t,s){"use strict";s.r(t);var o=s("p2Zk"),r=s("L2JU"),i=s("ripa"),a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o])}return e},n={components:{vTimeBtn:o.a},data:function(){var e=this,t=this.$store.getters.authType;return{activeName:"info",showdialog:!1,canSendCode:!1,cansubmit:!0,loginResetPasswordLoding:!1,password:{oldPassword:"",newPassword:"",reNewPassword:""},dialogForm:{title:"",type:"",code:"",phone:this.$store.getters.phone},dialogRules:{phone:[{validator:function(s,o,r){e.$refs.timeBtn.setDisabled(!0),t.require.reg.test(o)?t.phone.reg.test(o)?(e.$refs.timeBtn.setDisabled(!1),r()):r(new Error(t.phone.info)):r(new Error(t.require.info))},trigger:"blur"}],code:[{validator:function(s,o,r){e.cansubmit=!0,t.require.reg.test(o)?t.code.reg.test(o)?(e.cansubmit=!1,r()):r(new Error(t.code.info)):r(new Error(t.require.info))},trigger:"blur"}]},passwordFormRules:{oldPassword:[{validator:function(e,s,o){t.require.reg.test(s)?t.password.reg.test(s)?o():o(new Error(t.password.info)):o(new Error(t.require.info))},trigger:"blur"}],newPassword:[{validator:function(s,o,r){t.require.reg.test(o)?t.password.reg.test(o)?o===e.password.oldPassword?r(new Error("新密码和旧密码不能相同")):r():r(new Error(t.password.info)):r(new Error(t.require.info))},trigger:"blur"}],reNewPassword:[{validator:function(s,o,r){t.require.reg.test(o)?o!==e.password.newPassword?r(new Error("两次密码必须相同")):r():r(new Error(t.require.info))},trigger:"blur"}]}}},computed:a({info:function(){var e={name:this.$store.getters.name,role:this.$store.getters.role,phone:this.$store.getters.phone,avatar:this.$store.getters.avatar};return e}},Object(r.mapGetters)(["interval","regexp"])),methods:{opendialog:function(e){this.dialogForm.type=e,this.showdialog=!0,"bind"===e?this.dialogForm.title="绑定手机":"unbind"===e&&(this.dialogForm.title="解绑手机")},submitdialog:function(){var e=this;this.$refs.dialogForm.validate(function(t){if(t){var s=e.dialogForm,o=s.phone,r=s.code,a=s.type;"bind"==a?Object(i.a)({phone:o,code:r}).then(function(t){t.success?(e.$message.success(t.message),e.$store.dispatch("GetInfo")):e.$message.success(t.message),e.showdialog=!1}):"unbind"==a&&Object(i.d)({phone:o,code:r}).then(function(t){t.success?(e.$message.success(t.message),e.$store.dispatch("GetInfo")):e.$message.success(t.message),e.showdialog=!1})}else e.$message.error("请正确填写后提交")})},sendCode:function(){var e=this;if(this.dialogForm.phone){var t=this.dialogForm,s=t.phone,o=t.type;this.$refs.timeBtn.disable||Object(i.c)({phone:s,type:o}).then(function(t){t.success&&(e.$refs.timeBtn.start(),e.$message.success("验证码发送成功,请注意查看手机"))})}else this.$message.error("请正确输入手机号")},passwordFormSubmit:function(){var e=this;this.$refs.passwordForm.validate(function(t){t?(e.loginResetPasswordLoding=!0,e.$store.dispatch("LoginResetPassword",e.password).then(function(t){e.$message.success(t),e.loginResetPasswordLoding=!1,e.$refs.passwordForm.resetFields()}).catch(function(t){e.$message.error(t),e.loginResetPasswordLoding=!1,e.$refs.passwordForm.resetFields()})):(e.loginResetPasswordLoding=!1,e.$message.error("请正确填写后提交"))})}}},l=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("section",{staticClass:"userinfo"},[s("el-row",{attrs:{type:"flex",justify:"center"}},[s("el-col",{staticClass:"userinfo_wrap",attrs:{span:8}},[s("el-tabs",{model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[s("el-tab-pane",{attrs:{label:"个人信息",name:"info"}},[s("el-form",{ref:"infoForm",attrs:{model:e.info,"label-width":"100px"}},[s("el-form-item",{attrs:{label:"头像 :"}},[s("div",{staticClass:"userinfo_avatar"},[s("img",{attrs:{src:e.info.avatar}})])]),e._v(" "),s("el-form-item",{attrs:{label:"用户名 :"}},[s("el-input",{attrs:{disabled:!!e.info.name},model:{value:e.info.name,callback:function(t){e.$set(e.info,"name",t)},expression:"info.name"}})],1),e._v(" "),s("el-form-item",{attrs:{label:"角色 :"}},[s("el-input",{attrs:{disabled:!0},model:{value:e.info.role,callback:function(t){e.$set(e.info,"role",t)},expression:"info.role"}})],1),e._v(" "),s("el-form-item",{attrs:{label:"手机 :"}},[s("el-input",{attrs:{disabled:!0},model:{value:e.info.phone,callback:function(t){e.$set(e.info,"phone",t)},expression:"info.phone"}}),e._v(" "),e.info.phone?s("el-button",{attrs:{type:"text"},on:{click:function(t){e.opendialog("unbind")}}},[e._v("换绑手机")]):s("el-button",{attrs:{type:"text"},on:{click:function(t){e.opendialog("bind")}}},[e._v("绑定手机")]),e._v(" "),s("el-dialog",{attrs:{title:e.dialogForm.title,"status-icon":"",width:"500px","close-on-click-modal":!1,visible:e.showdialog},on:{"update:visible":function(t){e.showdialog=t}}},[s("el-form",{ref:"dialogForm",staticClass:"dialogForm",attrs:{model:e.dialogForm,rules:e.dialogRules,"label-width":"100px"}},[s("el-form-item",{attrs:{label:"手机号码 ",prop:"phone"}},[s("el-input",{attrs:{disabled:!!e.info.phone,type:"text","auto-complete":"off"},model:{value:e.dialogForm.phone,callback:function(t){e.$set(e.dialogForm,"phone",t)},expression:"dialogForm.phone"}})],1),e._v(" "),s("el-form-item",{attrs:{label:"验证码",prop:"code"}},[s("el-input",{attrs:{type:"text","auto-complete":"off"},model:{value:e.dialogForm.code,callback:function(t){e.$set(e.dialogForm,"code",t)},expression:"dialogForm.code"}}),e._v(" "),s("v-time-btn",{ref:"timeBtn",attrs:{value:"发送验证码",disabled:e.canSendCode,second:e.interval},on:{run:e.sendCode}})],1)],1),e._v(" "),s("span",{attrs:{slot:"footer"},slot:"footer"},[s("el-button",{attrs:{type:"primary",disabled:e.cansubmit},on:{click:function(t){e.submitdialog()}}},[e._v("确 定")])],1)],1)],1)],1)],1),e._v(" "),s("el-tab-pane",{attrs:{label:"修改密码",name:"password"}},[s("el-form",{ref:"passwordForm",attrs:{rules:e.passwordFormRules,"status-icon":"",model:e.password,"label-width":"100px"}},[s("el-form-item",{attrs:{prop:"oldPassword",label:"当前密码 :"}},[s("el-input",{attrs:{type:"password"},model:{value:e.password.oldPassword,callback:function(t){e.$set(e.password,"oldPassword",t)},expression:"password.oldPassword"}})],1),e._v(" "),s("el-form-item",{attrs:{prop:"newPassword",label:"设置新密码 :"}},[s("el-input",{attrs:{type:"password"},model:{value:e.password.newPassword,callback:function(t){e.$set(e.password,"newPassword",t)},expression:"password.newPassword"}})],1),e._v(" "),s("el-form-item",{attrs:{prop:"reNewPassword",label:"确定新密码 :"}},[s("el-input",{attrs:{type:"password"},model:{value:e.password.reNewPassword,callback:function(t){e.$set(e.password,"reNewPassword",t)},expression:"password.reNewPassword"}})],1),e._v(" "),s("el-form-item",{attrs:{label:" "}},[s("el-button",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:e.loginResetPasswordLoding,expression:"loginResetPasswordLoding",modifiers:{fullscreen:!0,lock:!0}}],attrs:{type:"primary","element-loading-text":"更改密码中"},on:{click:e.passwordFormSubmit}},[e._v("确定")])],1)],1)],1)],1)],1)],1)],1)};l._withStripped=!0;var d=s("JFUb"),c=!1;var u=function(e){c||s("/vi4")},p=Object(d.a)(n,l,[],!1,u,null,null);p.options.__file="app\\web\\views\\info\\userInfo.vue";t.default=p.exports},AFYs:function(e,t){},p2Zk:function(e,t,s){"use strict";var o={props:{second:{type:Number,default:60},value:{type:String,default:"获取验证码"},disabled:{type:Boolean,default:!1}},data:function(){return{time:0,disable:this.disabled}},methods:{run:function(){this.$emit("run")},start:function(){this.disable||(this.time=this.second,this.disable=!0,this.timer())},stop:function(){this.time=0,this.disable=!1},setDisabled:function(e){this.disable=e},timer:function(){this.time>0?(this.time--,setTimeout(this.timer,1e3)):this.disable=!1}},computed:{text:function(){return this.time>0?this.time+"s 后重获取":this.value}}},r=function(){var e=this.$createElement;return(this._self._c||e)("a",{staticClass:"timeBtn",class:this.disable||this.time>0?"timeBtn--disabled":"",attrs:{href:"javascript:void(0);"},on:{click:this.run}},[this._v("\n  "+this._s(this.text))])};r._withStripped=!0;var i=s("JFUb"),a=!1;var n=function(e){a||s("AFYs")},l=Object(i.a)(o,r,[],!1,n,"data-v-47ee6eb0",null);l.options.__file="app\\web\\components\\timeBtn\\index.vue";t.a=l.exports}}]);