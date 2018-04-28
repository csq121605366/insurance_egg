<template>
  <div class="fw">
    <div class="fw__tags">
      <el-tabs tab-position="top" v-model="mtag" @tab-click="mtagsClick" class="fw__tags__top">
        <el-tab-pane v-for="(item,index) in mtags" :key="item.key" :name="item._id" :label="item.label"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="fw__list">
      <el-row class="fw__list__row" :gutter="20">
        <el-col :span="2">
          <el-tabs tab-position="left" v-model="vtag" @tab-click="vtagsClick" class="fw__tags__left">
            <el-tab-pane v-for="(item,index) in vtags" :key="index" :name="''+item.key" :label="item.label"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="10">
          <el-collapse v-if="userlist&&userlist.length" v-model="activeNames">
            <el-collapse-item v-for="(x,i) in userlist" :key="i" class="userlist" :title="roleList[x._id.role]" :name="x._id.role">
              <el-button v-for="(y,j) in x.item" :key="j" @click="userClick(y.user_id)" class="userlist__item">{{y.name}}</el-button>
            </el-collapse-item>
          </el-collapse>
        </el-col>
        <el-col :span="12">
          <div class="fw__info">
            <el-card v-if="userinfo" shadow="hover" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <span>用户信息</span>
              </div>
              <div class="userinfo__base">
                <div class="userinfo__subtitle">基本信息</div>
                <div class="userinfo__subinfo">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <span>医生姓名：</span>
                      <span>{{userinfo.name}}</span>
                    </el-col>
                    <el-col :span="8">
                      <span>性别：</span>
                      <span>{{genderList[userinfo.gender]}}</span>
                    </el-col>
                    <el-col :span="8">
                      <span>提问时间：</span>
                      <span>{{genderList[userinfo.gender]}}</span>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="userinfo__extend">
                <div class="userinfo__subtitle">专业信息</div>
                <div class="userinfo__subinfo">
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  departmentMain,
  departmentVice,
  userListByDetail,
  userDetail
} from "@/api/app";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      mtag: "",
      mtags: [],
      vtag: "",
      vtags: [],
      userlist: "",
      activeNames: "",
      userinfo: ""
    };
  },
  computed: {
    ...mapGetters(["roleList", "genderList"])
  },
  beforeMount() {
    this.departmain();
  },
  methods: {
    departmain() {
      departmentMain().then(res => {
        this.mtags = res.data;
        this.mtag = res.data[0]._id;
        //初始化副类
        this.departmentVice(res.data[0]._id);
      });
    },
    departmentVice(_id) {
      departmentVice({ _id }).then(res => {
        this.vtags = res.data;
        this.vtag = res.data[0].key.toString();
      });
    },
    userListByDetail(key) {
      userListByDetail({ key }).then(res => {
        this.userlist = res.data;
      });
    },
    userDetail(user_id) {
      userDetail({ user_id }).then(res => {
        this.userinfo = res.data;
      });
    },
    mtagsClick() {
      this.departmentVice(this.mtag);
    },
    vtagsClick() {
      this.userListByDetail(this.vtag | 0);
    },
    userClick(user_id) {
      if (user_id) {
        this.userDetail(user_id);
      }
    }
  }
};
</script>

<style lang="scss">
.fw {
  padding: 20px 40px;
  box-sizing: content-box;
}

.userlist .el-collapse-item__content {
  display: flex;
  flex-flow: row wrap;
}
.userlist__item {
  // flex:0 1 auto;
  // padding: 20 30px;
  // border:1px solid
  // border-radius: 6px;
}
</style>
