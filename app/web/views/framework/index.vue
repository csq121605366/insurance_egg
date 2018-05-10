<template>
  <section class="fw">
    <div class="fw__tags">
      <el-tabs tab-position="top" v-model="mtag" @tab-click="mtagsClick" class="fw__tags__top">
        <el-tab-pane v-for="(item,index) in mtags" :key="item.key" :name="item._id" :label="item.label"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="fw__list">
      <el-row class="fw__list__row" :gutter="20">
        <el-col :span="3">
          <el-tabs tab-position="left" v-model="vtag" @tab-click="vtagsClick" class="fw__tags__left">
            <el-tab-pane v-for="(item,index) in vtags" :key="index" :name="''+item.key" :label="item.label"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="9">
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(x,i) in userlist" :key="i" class="userlist" :title="roleList[x._id.role]" :name="x._id.role">
              <el-button v-for="(y,j) in x.item" :key="j" @click="userClick(y.user_id)" class="userlist__item">{{y.name}}</el-button>
            </el-collapse-item>
          </el-collapse>
        </el-col>
        <el-col :span="12">
          <div class="fw__info">
            <el-card v-if="userinfo" shadow="hover" :body-style="{ padding: '20px' }">
              <div slot="header" class="userinfo__title clearfix">
                <span>用户信息</span>
              </div>
              <div class="userinfo__base">
                <div class="userinfo__subtitle">基本信息</div>
                <div class="userinfo__subinfo">
                  <el-row class="userinfo__row" :gutter="10">
                    <el-col :span="14">
                      <el-col :span="24">
                        <span class="userinfo__rowtitle">医生姓名：</span>
                        <span>{{userinfo.name}}</span>
                      </el-col>
                      <el-col :span="24">
                        <span class="userinfo__rowtitle">性别：</span>
                        <span>{{genderList[userinfo.gender]}}</span>
                      </el-col>
                      <el-col :span="24">
                        <span class="userinfo__rowtitle">手机号：</span>
                        <span>{{userinfo.phone}}</span>
                      </el-col>
                      <el-col :span="24">
                        <span class="userinfo__rowtitle">创建时间：</span>
                        <span>{{dayjs(userinfo.meta.created).format("YYYY MM-DD HH:mm")}}</span>
                      </el-col>
                      <el-col :span="24">
                        <span class="userinfo__rowtitle">审核时间：</span>
                        <span>{{dayjs(userinfo.audit_create).format("YYYY MM-DD HH:mm")}}</span>
                      </el-col>
                    </el-col>
                    <el-col :span="10">
                      <div class="userinfo__avatar">
                        <img :src="userinfo.avatar?userinfo.avatar.imageURL+'-webp':userinfo.avatarUrl" alt="">
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="userinfo__extend">
                <div class="userinfo__subtitle">扩展信息</div>
                <div class="userinfo__subinfo">
                  <el-row v-if="userinfo.role=='1'" class="userinfo__row">
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">治疗医生：</span>
                      <span>{{userinfo.doctor_name}}</span>
                    </el-col>
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">疾病名称：</span>
                      <span>{{userinfo.illness_name}}</span>
                    </el-col>
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">是否手术：</span>
                      <span>{{operationList[userinfo.operation]}}</span>
                    </el-col>
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">治疗信息：</span>
                      <div class="userinfo__images">
                        <div class="userinfo__image" @click="pickviewHandle(x.imageURL)" v-for="(x,i) in userinfo.treatment_info.treatment_images" :key="i">
                          <img :src="x.imageURL+'-webp'" alt="">
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row v-if="userinfo.role=='2'" class="userinfo__row">
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">就职医院：</span>
                      <span>{{userinfo.hospital.label}}</span>
                    </el-col>
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">医院所在省份：</span>
                      <span>{{userinfo.hospital.city}}</span>
                    </el-col>
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">就职科室：</span>
                      <span>{{genderList[userinfo.gender]}}</span>
                    </el-col>
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">职称：</span>
                      <span>{{dayjs(userinfo.audit_create).format("YYYY MM-DD HH:mm")}}</span>
                    </el-col>
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">个人简介：</span>
                      <span>{{userinfo.description}}</span>
                    </el-col>
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">资格证书：</span>
                      <div class="userinfo__images">
                        <div class="userinfo__image" @click="pickviewHandle(x.imageURL)" v-for="(x,i) in userinfo.certificate" :key="i">
                          <img :src="x.imageURL+'-webp'" alt="">
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row v-if="userinfo.role=='3'" class="userinfo__row">
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">关联科室：</span>
                      <el-row :gutter="10">
                        <el-col :span="8" v-for="(x,i) in userinfo.department" :key="i">
                          <el-tag>{{x.label}}</el-tag>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="24">
                      <span class="userinfo__rowtitle">代理医生：</span>
                      <el-row :gutter="10">
                        <el-col :span="8" v-for="(x,i) in userinfo.agency" :key="i">
                          <dl class="userinfo__agency">
                            <dt>{{x.department.label+':'}}</dt>
                            <dd v-for="(y,j) in x.name.split(' ')" :key="j">{{y}}</dd>
                          </dl>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="24">
                      <!-- <span class="userinfo__rowtitle">潜在代理医生：</span> -->
                      <el-collapse>
                        <el-collapse-item v-for="(x,i) in userinfo.friend" :key="i" :title="'潜在代理医生'+ ++i">
                          <el-row :gutter="20">
                            <el-col :span="12">姓名：{{x.name}}</el-col>
                            <el-col :span="12">手机号：{{x.phone}}</el-col>
                            <el-col :span="24">医院：{{x.hospital.label}}</el-col>
                            <el-col :span="12">科室：{{x.department.label}}</el-col>
                            <el-col :span="12">职称：{{x.title}}</el-col>
                          </el-row>
                        </el-collapse-item>
                      </el-collapse>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
    <div @click="pickview.show = false" v-show="pickview.show" class="pick-view">
      <img :src="pickview.url" alt="">
    </div>
  </section>
</template>

<script>
import {
  departmentMain,
  departmentVice,
  userListByDetail,
  userDetail
} from "@/api/app";
import { mapGetters } from "vuex";
import dayjs from "dayjs";
export default {
  data() {
    return {
      mtag: "",
      mtags: [],
      vtag: "",
      vtags: [],
      userlist: "",
      activeNames: ["1", "2", "3"],
      userinfo: "",
      pickview: {
        show: false,
        url: ""
      }
    };
  },
  computed: {
    ...mapGetters(["roleList", "genderList", "operationList"])
  },
  beforeMount() {
    this.departmain();
  },
  methods: {
    dayjs() {
      return dayjs(...arguments);
    },
    pickviewHandle(url) {
      if (url) {
        this.pickview.show = true;
        this.pickview.url = url;
      }
    },
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
.userinfo {
  &__title {
    font-size: 20px;
  }
  &__avatar {
    border-radius: 6px;
    border: 1px solid #333;
    width: 220px;
    height: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 200px;
      max-height: 200px;
    }
  }
  &__base,
  &__extend {
    padding: 0 10px;
  }
  &__subtitle {
    padding: 20px 0;
    font-size: 16px;
    font-weight: 600;
  }
  &__row {
    .el-col {
      padding: 10px 0;
    }
  }
  &__images {
    padding-top: 20px;
    display: flex;
    flex-flow: row wrap;
  }
  &__image {
    margin-right: 10px;
    margin-bottom: 10px;
    img {
      height: 100px;
      width: 100px;
      cursor: pointer;
    }
  }
  &__rowtitle {
    font-size: 18px;
    font-weight: 500;
  }
  &__agency {
    dd {
      line-height: 2;
    }
  }
}

.pick-view {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(3, 3, 3, 0.6);
  img {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    height: 460px;
    width: auto;
  }
}
</style>
