<template>
    <section class="app-wrapper">
        <app-main class="app-content" :active="active"></app-main>
        <mt-tabbar v-model="selected">
            <mt-tab-item id="/home">
                <i slot="icon" class="iconfont icon-shouye"></i>
                首页
            </mt-tab-item>
            <mt-tab-item id="/friend">
                <i slot="icon" class="iconfont icon-fenlei"></i>
                朋友
            </mt-tab-item>
            <mt-tab-item id="/my">
                <i slot="icon" class="iconfont icon-yonghu"></i>
                我的
            </mt-tab-item>
        </mt-tabbar>
    </section>
</template>

<script>
import AppMain from "./AppMain.vue";
export default {
  components: {
    AppMain
  },
  data() {
    return {
      selected: "/home",
      active: true
    };
  },
  watch: {
    selected: function(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style lang="scss">
.app-wrapper {
  .iconfont {
    font-size: 20px;
    font-weight: 600;
  }
}
.app-content {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
