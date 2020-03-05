<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import defaultFollowing from "./store/defaultFollowing.json";
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
    ...mapGetters(["blockchain", "accounts", "settings", "following"])
  },
  methods: {
    fetchMemosFromAddress(address) {
      this.$store.dispatch("memos/fetchAndAdd", {
        limit: 10,
        orderBy: ["timestamp", "desc"],
        where: [["address", "==", address]]
      });
    }
  },
  async mounted() {
    // log in the user if they exist
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("signInUser", user);
        this.$store.dispatch("settings/openDBChannel").catch(console.error);
      } else {
        // if user doesnt exist, create a default following
        this.$store.commit("setFollowing", defaultFollowing);
        // load memos
        this.following.map(address => this.fetchMemosFromAddress(address));
      }
    });

    // fetch the current block
    let response = await fetch(`${this.blockchain.lcd}/blocks/latest`);
    let data = await response.json();
    this.$store.commit("setHeight", data.block_meta.header.height);

    // continuouly fetch the latest blocks
    this.$store.dispatch("memos/openDBChannel", {
      orderBy: ["height", "desc"],
      where: [["height", ">=", this.blockchain.height - 256]]
    });

    // wipe out service workers (for now)
    if (window.navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
  },
  watch: {
    async "settings.data.wallet"() {
      let userAddress = this.settings.data.wallet.address;
      let userFollowing = [];
      let userAccountRef = Firebase.firestore()
        .collection("accounts")
        .doc(userAddress);

      // load the user's following
      await userAccountRef
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log("No such document!");
          } else {
            // console.log("Document data:", doc.data());
            userFollowing = doc.data().following;
          }
        })
        .catch(err => {
          console.log("Error getting document", err);
        });

      // add user's own address to following
      userFollowing.push(userAddress);

      // set user following
      this.$store.commit("setFollowing", userFollowing);

      // load memos from user's following
      this.following.map(address => this.fetchMemosFromAddress(address));
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
