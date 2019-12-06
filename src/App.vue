<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    this.$store.dispatch("memos/fetchAndAdd", { limit: 6 });
  }
};
</script>

<style lang="stylus">
@import './styles/normalize.css'
@import './styles/variables.css'
@import './styles/screen.css'

body
  padding 3rem 0
p
  margin 0
</style>
