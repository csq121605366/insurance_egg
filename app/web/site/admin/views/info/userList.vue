<template>
    <section style="width: 100%">
        <div class="shop-table-box" >
            <el-row style="padding-bottom: 20px">
                <el-col :xs="24" :sm="24" :md="10">
                    <h2 class="title">{{this.formName}}：
                        <router-link :to="{ path: '/user/addmanage'}" tag="button" class="el-button el-button--primary">添加管理员</router-link>
                        <!--<el-button @click="handleDownload" type="primary">下载管理员表</el-button>-->
                    </h2>
                </el-col>
                <el-col :xs="24" :sm="24" :md="14" style="padding-top: 10px">
                    <el-row :gutter="10" type="flex" justify="end">
                        <el-col :span="5">
                            <el-select v-model="queryData.role_name" placeholder="角色">
                                <el-option label="全部角色" value=""></el-option>
                                <el-option label="总经理" value="GeneralManager"></el-option>
                                <el-option label="项目经理" value="ProjectManager"></el-option>
                                <el-option label="财务经理" value="FinancialManager"></el-option>
                                <el-option label="楼面经理" value="ResidentialManager"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="10">
                            <el-input placeholder="请输入手机号或邮箱" v-model="queryData.keyWords">
                            </el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" icon="search" class="el-button-block" @click="getAdminUserList">查询</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-table :data="adminUserList" stripe border style="width: 100%">
                <el-table-column label="ID" prop="id"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="姓名" prop="real_name"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="手机号" prop="mobile"></el-table-column>
                <el-table-column label="创建时间" prop="created_at"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="danger" @click="dele(scope.$index, scope.row)">删除</el-button>
                        <!-- <router-link :to="{ name: '管理员信息', params: {id: scope.row.id }}" tag="button" class="el-button el-button--info el-button--small">编辑</router-link> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <el-pagination class="text-center" :current-page="current_page" :page-size="per_page" @current-change="currentChange" layout="total, prev, pager, next" :total="total">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">
import { userList, userDelete } from "../../api/user";

export default {
  data() {
    return {
      formName: "管理员信息列表",
      keywords: "",
      current_page: 1,
      per_page: 10,
      total: 0,
      adminUserList: [],
      queryData: {
        role_name: "",
        keyWords: ""
      }
    };
  },
  created() {
    // 组件创建完后获取数据，
    // 此时 data 已经被 observed 了
    this.getAdminUserList();
  },
  mounted() {},
  methods: {
    currentChange(page) {
      this.current_page = page;
      this.getAdminUserList();
    },
    getAdminUserList() {
      if (this.queryData.role_name && this.queryData.keyWords) {
        this.current_page = 1;
      }
      userList({
        token: this.$store.getters.token,
        role_name: this.queryData.role_name,
        keyWords: this.queryData.keyWords,
        page: this.current_page
      })
        .then(res => {
          if (res.code == 200) {
            this.adminUserList = res.data.data;
            this.current_page = res.data.current_page;
            this.per_page = res.data.per_page;
            this.total = res.data.total;
          }
        })
        .catch(error => {
          this.$message.error("网络出现问题，请刷新页面！");
        });
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    dele(index, obj) {
      this.$prompt("请输入 “确认删除” 四个字", "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^确认删除$/,
        inputErrorMessage: "只可输入 “确认删除” "
      })
        .then(({ value }) => {
          let token = this.$store.getters.token;
          userDelete({ id: obj.id, token })
            .then(res => {
              this.$message.success("删除成功!");
              this.getAdminUserList();
            })
            .catch(() => {
              this.$message.error("删除失败!");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss">
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 150px;
  color: #99a9bf;
}

.demo-table-expand.label-w120 label {
  width: 120px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.shop-table-box {
  padding: 0 20px 20px;
}

.shop-table-box .title {
  font-size: 16px;
}
</style>