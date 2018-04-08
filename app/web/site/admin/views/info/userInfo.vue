<template>
    <section class="userinfo">
        <el-row type="flex" justify="center">
            <el-col class="userinfo_wrap" :span="8">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="个人信息" name="person">
                        <el-form ref="infoForm" :model="info" label-width="100px">
                            <el-form-item label="头像 :">
                                <div class="userinfo_avatar">
                                    <img :src="info.avatar">
                                </div>
                            </el-form-item>
                            <el-form-item label="用户名 :">
                                <el-input :disabled="info.name?true:false" v-model="info.name"></el-input>
                            </el-form-item>
                            <el-form-item label="角色 :">
                                <el-input :disabled="true" v-model="info.role"></el-input>
                            </el-form-item>
                            <el-form-item label="手机 :">
                                <el-input :disabled="info.phone?true:false" v-model="info.phone"></el-input>
                                <el-button v-if="!info.phone" @click="opendialog('bindPhone')" type="text">绑定手机</el-button>
                                <el-button v-else @click="opendialog('updateEmail')" type="text">换绑手机</el-button>
                            </el-form-item>
                            <el-form-item label="邮箱 :">
                                <el-input :disabled="info.email" v-model="info.email"></el-input>
                                <el-button v-if="!info.email" @click="opendialog('bindEmail')" type="text">绑定邮箱</el-button>
                                <el-button v-else @click="opendialog('updateEmail')" type="text">换绑邮箱</el-button>
                                <!--模态框-->
                                <el-dialog :title="dialogForm.title"  status-icon width="500px" :close-on-click-modal="false" :visible.sync="showdialog" >
                                    <el-form class="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="100px" ref="dialogForm">
                                        <el-form-item v-if="dialogForm.type=='bindPhone'||dialogForm.type=='updatePhone'" label="手机 " prop="phone">
                                            <el-input :disabled="info.phone?true:false" type="text" v-model="dialogForm.phone" auto-complete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item v-else label="邮箱 " prop="email">
                                            <el-input :disabled="info.email?true:false" type="text" v-model="dialogForm.email" auto-complete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item label="验证码" prop="code">
                                            <el-input type="text" v-model="dialogForm.code" auto-complete="off"></el-input>
                                            <v-time-btn ref="timeBtn" @run="sendCode" value="发送验证码" :disabled="canSendCode" :second="interval"></v-time-btn>
                                        </el-form-item>
                                    </el-form>
                                    <span slot="footer">
                                        <el-button type="primary" :disabled="cansubmit" @click="submitdialog()">确 定</el-button>
                                    </span>
                                </el-dialog>
                                <!--模态框-->
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="修改密码" name="password">
                        <el-form :rules="passwordFormRules"  status-icon ref="passwordForm" :model="password" label-width="100px">
                            <el-form-item prop="oldPassword" label="当前密码 :">
                                <el-input type="password" v-model="password.oldPassword"></el-input>
                            </el-form-item>
                            <el-form-item prop="newPassword" label="设置新密码 :">
                                <el-input type="password" v-model="password.newPassword"></el-input>
                            </el-form-item>
                            <el-form-item prop="reNewPassword" label="确定新密码 :">
                                <el-input type="password" v-model="password.reNewPassword"></el-input>
                            </el-form-item>
                            <el-form-item label=" ">
                                <el-button type="primary" element-loading-text="更改密码中" v-loading.fullscreen.lock="loginResetPasswordLoding" @click="passwordFormSubmit">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import vTimeBtn from "@/components/timeBtn";
import { mapGetters } from "vuex";
import {
  sendEmail,
  sendPhone,
  unbindEmail,
  bindEmail,
  bindPhone,
  unbindPhone
} from "@/api/user";
export default {
  components: {
    vTimeBtn
  },
  data() {
    const authType = this.$store.getters.authType;
    /**
     * r:rules,
     * v:value,
     * c:callback
     */

    const validateEmail = (r, v, c) => {
      this.$refs.timeBtn.setDisabled(true);
      if (!authType.require.reg.test(v)) {
        c(new Error(authType.require.info));
      } else if (!authType.email.reg.test(v)) {
        c(new Error(authType.email.info));
      } else {
        this.$refs.timeBtn.setDisabled(false);
        c();
      }
    };
    const validateCode = (r, v, c) => {
      this.cansubmit = true;
      if (!authType.require.reg.test(v)) {
        c(new Error(authType.require.info));
      } else if (!authType.code.reg.test(v)) {
        c(new Error(authType.code.info));
      } else {
        this.cansubmit = false;
        c();
      }
    };
    const validateCurrentPassword = (r, v, c) => {
      if (!authType.require.reg.test(v)) {
        c(new Error(authType.require.info));
      } else if (!authType.password.reg.test(v)) {
        c(new Error(authType.password.info));
      } else {
        c();
      }
    };

    const validateNewPassword = (r, v, c) => {
      if (!authType.require.reg.test(v)) {
        c(new Error(authType.require.info));
      } else if (!authType.password.reg.test(v)) {
        c(new Error(authType.password.info));
      } else if (v === this.password.oldPassword) {
        c(new Error("新密码和旧密码不能相同"));
      } else {
        c();
      }
    };
    const validateRePassword = (r, v, c) => {
      if (!authType.require.reg.test(v)) {
        c(new Error(authType.require.info));
      } else if (v !== this.password.newPassword) {
        c(new Error("两次密码必须相同"));
      } else {
        c();
      }
    };
    return {
      activeName: "person",
      showdialog: false,
      canSendCode: false,
      cansubmit: true,
      loginResetPasswordLoding: false,
      password: {
        oldPassword: "",
        newPassword: "",
        reNewPassword: ""
      },
      dialogRules: {
        email: [{ validator: validateEmail, trigger: "blur,change" }],
        code: [{ validator: validateCode, trigger: "blur,change" }]
      },
      passwordFormRules: {
        oldPassword: [{ validator: validateCurrentPassword, trigger: "blur" }],
        newPassword: [{ validator: validateNewPassword, trigger: "blur" }],
        reNewPassword: [{ validator: validateRePassword, trigger: "blur" }]
      }
    };
  },
  computed: {
    info() {
      let info = {
        name: this.$store.getters.name,
        role: this.$store.getters.role,
        phone: this.$store.getters.phone,
        email: this.$store.getters.email,
        avatar: this.$store.getters.avatar
      };
      return info;
    },
    dialogForm() {
      let dialogForm = {
        title: "",
        type: "",
        email: this.$store.getters.email,
        phone: ""
      };
      return dialogForm;
    },
    ...mapGetters(["interval", "regexp"])
  },
  methods: {
    opendialog(type) {
      return this.$message.error("功能开发中...");
      this.dialogForm.type = type;
      this.showdialog = true;
      if (type === "bindPhone") {
        this.dialogForm.title = "绑定手机";
      } else if (type === "updatePhone") {
        this.dialogForm.title = "换绑手机";
      } else if (type === "bindEmail") {
        this.dialogForm.title = "绑定邮箱";
      } else if (type === "updateEmail") {
        this.dialogForm.title = "换绑邮箱";
      }
    },
    submitdialog() {
      this.$refs.dialogForm.validate(res => {
        if (res) {
          subFun(this.dialogForm).then(res => {
            this.$message.success("操作成功");
            // 关闭窗口
            this.showdialog = false;
            setTimeout(() => {
              location.reload();
            }, 1000);
          });
        } else {
          this.$message.error("请正确填写后提交");
        }
      });
    },
    sendCode() {
      // 发送邮箱验证码
      if (this.dialogForm.email) {
        let { email } = this.dialogForm;
        let token = this.$store.getters.token;
        if (!this.$refs.timeBtn.disable) {
          this.$refs.timeBtn.start();
          // 发送邮箱验证码
          sendEmail({ email, token }).then(res => {
            this.$message.success("邮件发送成功，请登录邮箱查看验证码");
          });
        }
      } else {
        this.$message.error("请正确输入邮箱后点击发送");
      }
    },
    passwordFormSubmit() {
      this.$refs.passwordForm.validate(res => {
        if (res) {
          this.loginResetPasswordLoding = true;
          this.$store
            .dispatch("LoginResetPassword", this.password)
            .then(res => {
              this.$message.success(res);
              this.loginResetPasswordLoding = false;
              this.$refs.passwordForm.resetFields();
            })
            .catch(error => {
              this.$message.error(error);
              this.loginResetPasswordLoding = false;
              this.$refs.passwordForm.resetFields();
            });
        } else {
          this.loginResetPasswordLoding = false;
          this.$message.error("请正确填写后提交");
        }
      });
    }
  }
};
</script>


<style lang="scss">
.userinfo {
  padding-top: 40px;
  &_wrap {
    background-color: #fff;
    box-shadow: 0 0 4px rgba($color: #333, $alpha: 0.6);
    border-radius: 4px;
    padding: 20px;
    min-width: 500px;
  }
  &_avatar {
    img {
      max-height: 160px;
    }
  }
  .el-tabs__nav {
    width: 100%;
  }

  .el-tabs__item {
    width: 50%;
    text-align: center;
  }

  .el-tabs__header {
    margin: 0 0 30px 0;
  }

  .el-input {
    width: 240px;
    margin-right: 20px;
  }

  .el-form-item.el-form-item {
    margin-bottom: 22px;
  }

  .el-tab-pane {
    padding-left: 40px;
  }

  .dialogForm {
    .el-form-item__error {
      margin-left: 100px;
    }
  }
}
</style>


