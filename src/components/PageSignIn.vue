<template lang="pug">
.page
  page-header(page-title="Sign In")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
  #firebaseui-auth-container
</template>

<script>
import { Firebase } from "../store/firebase.js";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import { mapGetters } from "vuex";
import PageHeader from "./PageHeader";
import BtnIcon from "./BtnIcon";
export default {
  name: "page-signin",
  components: {
    BtnIcon,
    PageHeader
  },
  mounted() {
    let ui = new firebaseui.auth.AuthUI(Firebase.auth());
    let uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [
        Firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        Firebase.auth.GithubAuthProvider.PROVIDER_ID
      ]
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>

<style scoped lang="stylus"></style>
