<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { Firebase } from "./store/firebase.js";
import { mapGetters } from "vuex";
export default {
  name: "app",
  metaInfo: {
    title: "Uncensorable, decentralized social network built on the Cosmos Hub",
    titleTemplate: "%s - Dither Alpha",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  computed: {
    ...mapGetters(["blockchain"])
  },
  async mounted() {
    // log in the user if they exist
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("signInUser", user);
        this.$store.dispatch("settings/openDBChannel").catch(console.error);
      }
    });

    // fetch the current block, and then get some recent memos
    let response = await fetch(`${this.blockchain.lcd}/blocks/latest`);
    let data = await response.json();
    // let height = data.block_meta.header.height;
    this.$store.commit("setHeight", data.block_meta.header.height);

    /*
    this.$store.dispatch("memos/openDBChannel", {
      orderBy: ["height", "desc"],
      where: [
        ["height", ">=", this.blockchain.height - this.blockchain.blockRange]
      ]
    });
    */

    // only fetch the latest 50 memos
    this.$store.dispatch("memos/fetchAndAdd", {
      limit: 50,
      orderBy: ["timestamp", "desc"]
    });

    // disable service workers for now
    if (window.navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
  }
};
</script>

<style lang="stylus">
@import './styles/normalize.css'
@import './styles/variables.css'

*
  box-sizing border-box

html
  font 16px/1.5 var(--sans)
  background hsl(0,0,97%)

body
  padding 3rem 0
  min-height 100vh
  max-width 40rem
  margin 0 auto
  background var(--app-bg)

a
  text-decoration none
  color var(--link)
  cursor pointer
  &:hover
    color var(--hover)
p
  margin 0

.dont-break-out
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

.break-address
  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;
</style>
