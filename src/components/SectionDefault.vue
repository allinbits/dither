<template lang="pug">
.section-default: slot
</template>

<script>
import { Firebase } from "../store/firebase.js";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import { mapGetters } from "vuex";
import PageHeader from "./PageHeader";
import BtnIcon from "./BtnIcon";
export default {
  name: "section-default"
};
</script>

<style scoped lang="stylus">
.section-default
  border-bottom 1px solid var(--bc)
  padding 1rem
</style>
