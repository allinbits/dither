<template lang="pug">
.page
  li(v-for("i in media")) {{ i.title }}
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "page-index",
  computed: {
    ...mapGetters(["media"])
  },
  data: () => ({
    msg: "hi"
  })
};
</script>

<style scoped lang="stylus">
.page
  background #f00
</style>
