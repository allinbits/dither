<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { Firebase } from "./store/firebase.js";

export default {
  name: "App",
  mounted() {
    this.$store.dispatch("memos/fetchAndAdd", {
      limit: 6,
      orderBy: ["timestamp", "desc"]
    });

    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("signInUser", user);
        this.$store.dispatch("settings/openDBChannel").catch(console.error);
      }
    });
  }
};
</script>

<style lang="stylus">
@import './styles/normalize.css'
@import './styles/variables.css'
@import './styles/screen.css'

html
  background hsl(0,0,97%)

body
  padding 3rem 0
  min-height 100vh
  max-width 40rem
  margin 0 auto
  background #fff

a
  color var(--link)
  cursor pointer
  &:hover
    color var(--hover)
p
  margin 0
</style>
