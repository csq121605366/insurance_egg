<template>
  <div class="fw">
      <el-row :gutter="20">
        <el-col :span="12">
            <div class="fw__tags">
                <el-tabs tab-position="left" v-model="tagsListDefault" type="card" style="height: 200px;">
                    <el-tab-pane v-for="(item,index) in tagsList" :key="item.name" :name="item.name" :label="item.label"></el-tab-pane>
                </el-tabs>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="fw__info">

            </div>
        </el-col>
      </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tagsListDefault: '1',
      tagsList: []
    };
  }
};
</script>

<style scoped lang="scss">

</style>
