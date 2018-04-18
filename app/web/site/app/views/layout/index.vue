<template>
  <section class="app-wrapper">
    <app-main class="app-content"></app-main>
  </section>
</template>

<script>
import AppMain from "./AppMain.vue";
export default {
  components: {
    AppMain
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.app-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.app-content {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
</style>
