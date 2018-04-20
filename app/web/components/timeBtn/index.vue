<!--使用方法-->

<template>
  <a href="javascript:void(0);" class="timeBtn" :class="disable||time>0? 'timeBtn--disabled':''" v-on:click="run">
    {{ text }}</a>
</template>

<script>
  export default {
    props: {
      second: {
        type: Number,
        default: 60
      },
      value: {
        type: String,
        default: '获取验证码'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        time: 0,
        disable: this.disabled
      }
    },
    methods: {
      run: function () {
        this.$emit('run')
      },
      start: function () {
        if (!this.disable) {
          this.time = this.second
          this.disable = true
          this.timer()
        }
      },
      stop: function () {
        this.time = 0
        this.disable = false
      },
      setDisabled: function (val) {
        this.disable = val
      },
      timer: function () {
        if (this.time > 0) {
          this.time--
          setTimeout(this.timer, 1000);
        } else {
          this.disable = false
        }
      }
    },
    computed: {
      text: function () {
        return this.time > 0 ? this.time + 's 后重获取' : this.value
      }
    }
  }
</script>

<style lang="scss" scoped>
  .timeBtn.timeBtn--disabled {
    color: #ccc!important;
    cursor: not-allowed;
  }
</style>
