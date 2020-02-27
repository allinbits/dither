<template lang="pug">
.page-login
  app-header(page-title="Sign In")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
  #firebaseui-auth-container
</template>

<script>
import { Firebase } from "../store/firebase.js";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import AppHeader from "@/components/AppHeader";
import BtnIcon from "@/components/BtnIcon";
export default {
  name: "page-login",
  metaInfo: { title: "Sign In" },
  components: {
    BtnIcon,
    AppHeader
  },
  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance();

    // solves `An AuthUI instance already exists for the key`
    // by not starting another ui instance if one exists
    // https://softauthor.com/firebaseui-vue-login-with-facebook-google-and-email-pasword/
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(Firebase.auth());
    }

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
