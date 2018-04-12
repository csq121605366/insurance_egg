<template>
  <section class="doctor-list">
    <el-tabs class="tabs" type="border-card">
      <el-tab-pane label="待审核">
          <el-table
          :data="uncheckedData.list"
          border
          height="720"
          style="width: 100%">
          <el-table-column
            fixed
            prop="name"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="gender"
            label="性别"
            width="120">
          </el-table-column>
          <el-table-column
            prop="province"
            label="就职医院"
            width="120">
          </el-table-column>
          <el-table-column
            prop="title"
            label="职称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="description"
            label="个人简介"
            width="300">
          </el-table-column>
          <el-table-column
            prop="certificate"
            label="医师资格证"
            width="320">
          </el-table-column>
           <el-table-column
            prop="audit_create"
            label="提交时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="audit_end"
            label="审核时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="status"
            label="审核状态"
            width="120">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
          <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
          </template>
      </el-table-column>
    </el-table>
      <el-row>
        <el-col :span="12" style="padding-top: 20px; font-size: 15px; line-height: 28px;">
            共&nbsp;{{uncheckedData.total}}&nbsp;条，
            每页&nbsp;{{uncheckedData.per_page}}&nbsp;条，
            当前第&nbsp;{{uncheckedData.current_page}}&nbsp;页
        </el-col>
        <el-col :span="12">
            <el-pagination class="text-right" style="float: right"
            :current-page="uncheckedData.current_page" :page-size="uncheckedData.per_page" @current-change="uncheckedDataPageChange" layout="total, prev, pager, next" :total="uncheckedData.total">
            </el-pagination>
        </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="已审核">
        <el-table
          :data="checkedData.list"
          border
          height="720"
          style="width: 100%">
          <el-table-column
            fixed
            prop="name"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="gender"
            label="性别"
            width="120">
          </el-table-column>
          <el-table-column
            prop="province"
            label="就职医院"
            width="120">
          </el-table-column>
          <el-table-column
            prop="title"
            label="职称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="description"
            label="个人简介"
            width="300">
          </el-table-column>
          <el-table-column
            prop="certificate"
            label="医师资格证"
            width="320">
          </el-table-column>
           <el-table-column
            prop="audit_create"
            label="提交时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="audit_end"
            label="审核时间"
            width="120">
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="status"
            label="审核状态"
            width="120">
          </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="12" style="padding-top: 20px; font-size: 15px; line-height: 28px;">
            共&nbsp;{{checkedData.total}}&nbsp;条，
            每页&nbsp;{{checkedData.per_page}}&nbsp;条，
            当前第&nbsp;{{checkedData.current_page}}&nbsp;页
        </el-col>
        <el-col :span="12">
            <el-pagination class="text-right" style="float: right"
            :current-page="checkedData.current_page" :page-size="checkedData.per_page" @current-change="checkedDataPageChange" layout="total, prev, pager, next" :total="checkedData.total">
            </el-pagination>
        </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
export default {
  data() {
    return {
      uncheckedData: [],
      checkedData: []
    };
  },
  methods: {
    uncheckedDataPageChange(e) {
      console.log(e);
    },
    checkedDataPageChange(e) {
      console.log(e);
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
