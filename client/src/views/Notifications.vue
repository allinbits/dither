<template lang="pug">
.page-notifications
  app-header(page-title="Notifications")
  .notifications
    card-message(v-if="!settings")
    card-notification(v-else v-for="n in orderedNotifications" :key="n.id" :notification="n")
  app-footer
</template>

<script>
import { Firebase } from "../store/firebase.js";
import { mapGetters } from "vuex";
import { orderBy } from "lodash";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import CardMessage from "@/components/CardMessage";
import CardNotification from "@/components/CardNotification";
export default {
  name: "page-notifications",
  metaInfo: { title: "Notifications" },
  components: {
    AppFooter,
    AppHeader,
    CardMessage,
    CardNotification
  },
  computed: {
    ...mapGetters(["notifications", "user", "userSignedIn", "settings"]),
    orderedNotifications() {
      let value = [];
      if (this.notifications && Object.keys(this.notifications).length > 0) {
        value = orderBy(this.notifications, "timestamp", "desc");
      }
      return value;
    }
  },
  mounted() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("settings/openDBChannel").catch(console.error);
      } else {
        this.$router.push("/login");
      }
    });
  },
  watch: {
    settings() {
      this.$store.dispatch("notifications/openDBChannel", {
        accountId: this.settings.wallet.address
      });
    }
  }
};
</script>

<style scoped lang="stylus"></style>
