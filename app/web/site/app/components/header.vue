<template>
    <header class="c-header" :class="{ 'is-fixed': fixed }">
        <div class="c-header-button is-left">
        </div>
        <h1 class="c-header-title" v-text="title"></h1>
        <div class="c-header-button is-right"></div>
    </header>
</template>

<script>
export default {
  name: "mt-header",
  props: {
    fixed: Boolean,
    title: String
  }
};
</script>

<style lang="css">
.c-header {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #2bb5f5;
  box-sizing: border-box;
  color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 18px;
  height: 70px;
  line-height: 1;
  padding: 25px 10px 0;
  position: relative;
  text-align: center;
  white-space: nowrap;
  z-index: 999;
}
.c-header .c-button {
  background-color: transparent;
  border: 0;
  box-shadow: none;
  color: inherit;
  display: inline-block;
  padding: 0;
  font-size: inherit;
}
.c-header .c-button::after {
  content: none;
}
.c-header.is-fixed {
  top: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 999;
}
.c-header-button {
  -webkit-box-flex: 0.5;
  -ms-flex: 0.5;
  flex: 0.5;
}
.c-header-button > a {
  color: inherit;
}
.c-header-button.is-right {
  text-align: right;
}
.c-header-button.is-left {
  text-align: left;
}
.c-header-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
  font-weight: 400;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
</style>
