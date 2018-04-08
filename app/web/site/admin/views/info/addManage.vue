<template>
    <section class="addmanage">
        <el-row type="flex" justify="center">
            <el-col class="wrap" :span="8">
                <h3 class="center pt20 pb20">{{pageName}}</h3>
                <el-form :model="userForm" :rules="userFormValidate" class="userForm" ref="userForm" label-width="100px">
                    <el-form-item label="用户名" prop="real_name">
                        <el-input type="text" v-model="userForm.real_name" auto-complete="off" placeholder="真实姓名(必填)"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input type="text" v-model="userForm.email" auto-complete="off" placeholder="邮箱账号(必填)"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input type="text" v-model="userForm.mobile" auto-complete="off" placeholder="手机号(选填)"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="userForm.password" auto-complete="off" placeholder="密码(必填)"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="repassword">
                        <el-input type="password" v-model="userForm.repassword" auto-complete="off" placeholder="确认密码(必填)"></el-input>
                    </el-form-item>
                    <el-form-item v-if="rolelist" label="角色" prop="roleid">
                        <el-select v-model="userForm.role_id" placeholder="选择角色(必选)">
                            <el-option v-for="(roleItem,index) in rolelist" :key="index" :label="roleItem.display_name" :value="roleItem.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if='!userForm.id' class="btn" type="danger" @click="resetForm('userForm')">重置</el-button>
                        <el-button class="btn" type="primary" @click="submitForm('userForm')">保存</el-button>
                        <el-button class="btn" v-if='userForm.id' @click="backHistory">返回</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import { rolelist, register, userList } from "../../api/user";

export default {
  data() {
    let { authType } = this.$store.state.app;
    const realNameValidete = (r, v, c) => {
      if (!authType.require.reg.test(v)) {
        c(new Error(authType.require.info));
      } else if (!authType.cname.reg.test(v)) {
        c(new Error(authType.cname.info));
      } else {
        c();
      }
    };
    const emailValidete = (r, v, c) => {
      if (!authType.require.reg.test(v)) {
        c(new Error(authType.require.info));
      } else if (!authType.email.reg.test(v)) {
        c(new Error(authType.email.info));
      } else {
        c();
      }
    };
    const mobileValidete = (r, v, c) => {
      if (!v) {
        c();
      } else if (!authType.phone.reg.test(v)) {
        c(new Error(authType.phone.info));
      } else {
        c();
      }
    };

    const passwordValidete = (r, v, c) => {
      if (!authType.require.reg.test(v)) {
        c(new Error(authType.require.info));
      } else if (!authType.password.reg.test(v)) {
        c(new Error(authType.password.info));
      } else {
        c();
      }
    };

    const repasswordValidete = (r, v, c) => {
      if (!authType.require.reg.test(v)) {
        c(new Error(authType.require.info));
      } else if (!authType.password.reg.test(v)) {
        c(new Error(authType.password.info));
      } else {
        c();
      }
    };
    const roleidValidate = (r, v, c) => {
      if (!authType.require.reg.test(v)) {
        c(new Error(authType.require.info));
      } else {
        c();
      }
    };

    return {
      pageName: this.$route.params.id ? "管理员信息修改" : "创建管理员",
      userForm: {
        token: this.$store.getters.token,
        id: null,
        real_name: "",
        email: "",
        mobile: "",
        password: "",
        repassword: "",
        role_id: 2
      },
      userFormValidate: {
        real_name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: realNameValidete, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: emailValidete, trigger: "blur" }
        ],
        mobile: [{ validator: mobileValidete, trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: passwordValidete, trigger: "blur" }
        ],
        repassword: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: repasswordValidete, trigger: "blur" }
        ],
        /* roleid: { validator: roleidValidate, trigger: 'change' }, */
        roleid: [
          { validator: roleidValidate, trigger: "change" }
          // { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      rolelist: []
    };
  },
  mounted() {
    if (this.$route.params.id) {
      this.userForm.id = this.$route.params.id;
      this.getManagerInfo(this.$route.params.id);
    }
  },
  methods: {
    getManagerInfo(id) {
      userList({
        token: this.$store.getters.token,
        id: id
      })
        .then(res => {
          if (res.code == 200) {
            let managerInfo = res.data.data[0];
            this.userForm.real_name = managerInfo.real_name;
            this.userForm.email = managerInfo.email;
            this.userForm.mobile = managerInfo.mobile;
            /* console.log(this.rolelist); */
            this.rolelist.forEach(item => {
              if (item.name === managerInfo.role_name) {
                this.userForm.role_id = item.id;
              }
            });
            /* for(i in this.rolelist){
                        if(item.name === managerInfo.role_name){
                            this.userForm.role_id = item.id;
                        }
                    } */
            this.userForm.role_name = managerInfo.role_name;
          }
        })
        .catch(error => {
          this.$message.error("网络出现问题，请刷新页面！");
        });
    },
    backHistory() {
      this.$router.go(-1);
    },
    submitForm(data) {
      this.$refs[data].validate(flag => {
        if (flag) {
          /* 验证成功提交表单 */
          register(this.userForm)
            .then(res => {
              if (res.code == 200) {
                this.$message.success("新用户注册成功!");
              }
              this.resetForm(data);
            })
            .catch(() => {
              this.resetForm(data);
            });
        } else {
          return false;
        }
      });
    },
    resetForm(data) {
      this.$refs[data].resetFields();
    }
  },
  beforeMount() {
    rolelist({ token: this.$store.getters.token }).then(res => {
      res.data.filter(item => {
        if (item.role_name !== "root") {
          this.rolelist.push(item);
        }
      });
    });
  }
};
</script>

<style lang="scss">
.addmanage {
  .wrap {
    background-color: #fff;
    border-radius: 4px;
    padding: 20px;
  }
  .userForm {
    margin: 0 auto;
  }
  .btn {
    width: 48%;
    margin-left: 0;
  }
}
</style>
