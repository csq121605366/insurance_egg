<template>
  <section>
      <transition name="fade" mode="out-in">
          <router-view></router-view>
      </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  props: ["active"],
  mounted() {}
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
