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
      limit: 10
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

.dont-break-out
  line-height 1.25

  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
</style>
