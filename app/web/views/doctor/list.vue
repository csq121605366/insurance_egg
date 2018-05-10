<template>
  <section class="doctor-list">
    <el-tabs @tab-click="tabClick" activeName="uncheckedData" class="tabs" type="border-card">
      <el-tab-pane name="uncheckedData" label="待审核">
        <el-table :data="uncheckedData.list" ref="uncheckedData" key="uncheckedData" border max-height="720">
          <el-table-column label="头像" width="120">
            <template slot-scope="scope">
              <img class="tabs__avatar" :src="scope.row.avatar?scope.row.avatar.imageURL:scope.row.avatarUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="120">
          </el-table-column>
          <el-table-column label="性别" width="60">
            <template slot-scope="scope">
              {{genderList[scope.row.gender]}}
            </template>
          </el-table-column>
          <el-table-column prop="hospital.label" label="就职医院" width="220">
          </el-table-column>
          <el-table-column prop="title" label="职称" width="120">
          </el-table-column>
          <el-table-column label="科室" width="120">
            <template v-if="scope.row.department" slot-scope="scope">
              <el-tag v-for="(item,index) in scope.row.department" :key="index">{{item.label}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="个人简介">
          </el-table-column>
          <el-table-column label="医师资格证" width="320">
            <template v-if="scope.row.certificate" slot-scope="scope">
              <img v-for="(item,index) in scope.row.certificate" class="img" @click.self="pickviewHandle(item.imageURL)" :key="index" :src="item.imageURL" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="" label="提交时间" width="140">
            <template slot-scope="scope">
              {{dayjs(scope.row.audit_create).format("YYYY MM-DD HH:mm")}}
            </template>
          </el-table-column>
          <!-- <el-table-column label="审核状态" width="120">
            <template slot-scope="scope">
              <el-tag type="danger">{{statusList[scope.row.status]}}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column v-if="role=='9'" label="操作" width="160">
            <template slot-scope="scope">
              <el-button @click="auditSuccess(scope.row)" type="primary" size="small">通过</el-button>
              <el-button @click="auditError(scope.row)" type="danger" size="small">不通过</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="12" :offset="6" class="paging">
            <el-pagination @size-change="handleSizeChange('uncheckedData',$event)" @current-change="handleCurrentChange('uncheckedData')" :current-page="uncheckedData.currentPage" :page-sizes="uncheckedData.limitList" :page-size="uncheckedData.limit" layout="total, sizes, prev, pager, next, jumper" :total="uncheckedData.amount">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="checkedData" label="已审核">
        <el-table :data="checkedData.list" ref="checkedData" key="checkedData" border max-height="720">
          <el-table-column label="头像" width="120">
            <template slot-scope="scope">
              <img class="tabs__avatar" :src="scope.row.avatar?scope.row.avatar.imageURL:scope.row.avatarUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="120">
          </el-table-column>
          <el-table-column label="性别" width="60">
            <template slot-scope="scope">
              {{genderList[scope.row.gender]}}
            </template>
          </el-table-column>
          <el-table-column prop="hospital.label" label="就职医院" width="220">
          </el-table-column>
          <el-table-column label="科室" width="120">
            <template v-if="scope.row.department" slot-scope="scope">
              <el-tag v-for="(item,index) in scope.row.department" :key="index">{{item.label}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="职称" width="120">
          </el-table-column>
          <el-table-column prop="description" label="个人简介">
          </el-table-column>
          <el-table-column label="医师资格证" width="320">
            <template v-if="scope.row.certificate" slot-scope="scope">
              <img v-for="(item,index) in scope.row.certificate" class="img" @click.self="pickviewHandle(item.imageURL)" :key="index" :src="item.imageURL" alt="">
            </template>
          </el-table-column>
          <el-table-column label="提交时间" width="140">
            <template slot-scope="scope">
              {{dayjs(scope.row.audit_create).format("YYYY MM-DD HH:mm")}}
            </template>
          </el-table-column>
          <el-table-column label="审核时间" width="140">
            <template slot-scope="scope">
              {{dayjs(scope.row.audit_end).format("YYYY MM-DD HH:mm")}}
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="12" :offset="6" class="paging">
            <el-pagination @size-change="handleSizeChange('checkedData',$event)" @current-change="handleCurrentChange('checkedData',$event)" :current-page="checkedData.currentPage" :page-sizes="checkedData.limitList" :page-size="checkedData.limit" layout="total, sizes, prev, pager, next, jumper" :total="checkedData.amount"></el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div @click="pickview.show = false" v-show="pickview.show" class="pick-view">
      <img :src="pickview.url" alt="">
    </div>
  </section>
</template>

<script>
import { userList, userAudit } from "@/api/app";
import { mapGetters } from "vuex";
import dayjs from "dayjs";

export default {
  data() {
    return {
      roleType: "2",
      uncheckedData: {
        list: [],
        status: "1",
        amount: 0,
        limit: 10,
        limitList: [10, 20, 50],
        currentPage: 1
      },
      checkedData: {
        list: [],
        status: "2",
        amount: 0,
        limit: 10,
        limitList: [10, 20, 50],
        currentPage: 1
      },
      default: "uncheckedData",
      pickview: {
        show: false,
        url: ""
      }
    };
  },
  computed: {
    ...mapGetters(["genderList", "role"])
  },
  mounted() {
    this.getData();
  },
  methods: {
    dayjs() {
      return dayjs(...arguments);
    },
    getData() {
      let param = {
        role: this.roleType,
        status: this[this.default].status,
        limit: this[this.default].limit,
        currentPage: this[this.default].currentPage
      };
      userList(param).then(res => {
        this[this.default].list = res.data.list;
        this[this.default].amount = res.data.amount;
      });
    },
    pickviewHandle(url) {
      if (url) {
        this.pickview.show = true;
        this.pickview.url = url;
      }
    },
    tabClick(e) {
      this.$refs[e.name].doLayout();
      this.default = e.name;
      this.getData();
    },
    handleSizeChange(item, num) {
      this[item].limit = num;
      this.default = item;
      this.getData();
    },
    handleCurrentChange(item, e) {
      this[item].currentPage = e;
      this.default = item;
      this.getData();
    },
    auditSuccess(item) {
      let user_id = item._id;
      this.$confirm("确认审核通过?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        userAudit({ user_id, status: "2" }).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.getData();
          } else {
            this.$message.error(res.message);
          }
        });
      });
    },
    auditError(item) {
      let user_id = item._id;
      this.$confirm("确认审核不通过?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        userAudit({ user_id, status: "3" }).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.getData();
          } else {
            this.$message.error(res.message);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss">
.tabs__avatar {
  width: 80px;
  height: auto;
  border-radius: 6px;
}
.doctor-list {
  padding: 20px 40px;
  .el-tabs__nav {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    .el-tabs__item {
      text-align: center;
      flex: 1 1 auto;
    }
  }
  .paging {
    margin-top: 20px;
    margin-bottom: 10px;
    text-align: center;
  }
  .img {
    height: 80px;
    width: auto;
    padding: 6px;
    cursor: pointer;
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
}
</style>
