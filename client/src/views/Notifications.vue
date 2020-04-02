<template lang="pug">
.page-notifications
  app-header(page-title="Notifications")
  .notifications
    card-message(v-if="!settings")
    card-notification(v-else v-for="n in orderedNotifications" :key="n.id" :notification="n")
  app-footer
</template>

<script>
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
  methods: {
    async notificationsOpenDBChannel(settings) {
      try {
        await this.$store.dispatch("notifications/openDBChannel", {
          accountId: settings.wallet.address
        });
      } catch {
        console.warn("The notification channel is already opened.");
      }
    }
  },
  created() {
    this.$store
      .dispatch("fetchSettings")
      .then(this.notificationsOpenDBChannel)
      .catch(() => this.$router.push("/login"));
  }
};
</script>

<style scoped lang="stylus"></style>
