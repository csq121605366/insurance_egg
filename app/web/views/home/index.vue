<template>
  <div class="home-container">
    <div class="home-text">name:{{name}}</div>
    <div class="home-text">role:{{adminRoleList[role]}}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "home",
  computed: {
    ...mapGetters(["name", "role", "adminRoleList"])
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.home {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
