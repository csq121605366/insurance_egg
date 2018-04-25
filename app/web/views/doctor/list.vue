<template>
  <section class="doctor-list">
    <el-tabs @tab-click="tabClick" activeName="uncheckedData" class="tabs" type="border-card">
      <el-tab-pane name="uncheckedData" label="待审核">
        <el-table :data="uncheckedData.list" ref="uncheckedData" key="uncheckedData" border height="720">
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="120">
          </el-table-column>
          <el-table-column prop="province" label="就职医院" width="120">
          </el-table-column>
          <el-table-column prop="title" label="职称" width="120">
          </el-table-column>
          <el-table-column prop="description" label="个人简介" width="300">
          </el-table-column>
          <el-table-column prop="certificate" label="医师资格证" width="320">
          </el-table-column>
          <el-table-column prop="audit_create" label="提交时间" width="120">
          </el-table-column>
          <el-table-column prop="audit_end" label="审核时间" width="120">
          </el-table-column>
          <el-table-column prop="status" label="审核状态" width="120">
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <div class="paging">
            <el-pagination @size-change="handleSizeChange('uncheckedData',$event)" @current-change="handleCurrentChange('uncheckedData')" :current-page="uncheckedData.currentPage" :page-sizes="uncheckedData.limitList" :page-size="uncheckedData.limit" layout="total, sizes, prev, pager, next, jumper" :total="uncheckedData.amount">
            </el-pagination>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="checkedData" label="已审核">
        <el-table :data="checkedData.list" ref="checkedData" key="checkedData" border height="720">
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="120">
          </el-table-column>
          <el-table-column prop="province" label="就职医院" width="120">
          </el-table-column>
          <el-table-column prop="title" label="职称" width="120">
          </el-table-column>
          <el-table-column prop="description" label="个人简介" width="300">
          </el-table-column>
          <el-table-column prop="certificate" label="医师资格证" width="320">
          </el-table-column>
          <el-table-column prop="audit_create" label="提交时间" width="120">
          </el-table-column>
          <el-table-column prop="audit_end" label="审核时间" width="120">
          </el-table-column>
          <el-table-column prop="status" label="审核状态" width="120">
          </el-table-column>
        </el-table>
        <el-row>
          <div class="paging">
            <el-pagination @size-change="handleSizeChange('checkedData',$event)" @current-change="handleCurrentChange('checkedData')" :current-page="checkedData.currentPage" :page-sizes="checkedData.limitList" :page-size="checkedData.limit" layout="total, sizes, prev, pager, next, jumper" :total="checkedData.amount"></el-pagination>
          </div>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import { userList } from "@/api/app";
export default {
  data() {
    return {
      uncheckedData: {
        list: [],
        status: "1",
        amount: 0,
        limit: 1,
        limitList: [1, 2, 3],
        currentPage: 1
      },
      checkedData: {
        list: [],
        status: "2",
        amount: 0,
        limit: 1,
        limitList: [1, 2, 3],
        currentPage: 1
      },
      default: "uncheckedData"
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let param = {
        role: "2",
        status: this[this.default].status,
        limit: this[this.default].limit,
        currentPage: this[this.default].currentPage
      };
      userList(param).then(res => {
        this[this.default].list = res.data.list;
        this[this.default].amount = res.data.amount;
        this[this.default].currentPage = res.data.currentPage;
      });
    },
    tabClick(e) {
      this.$refs[e.name].doLayout();
      this.default = e.name;
      this.getData();
    },
    handleSizeChange(item, num) {
      this[item].limit = num;
    },
    handleCurrentChange(item, e) {
      console.log(this[item].currentPage);
    }
  }
};
</script>

<style lang="scss">
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
}
</style>
