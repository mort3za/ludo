<style lang="scss">
@import "@/styles/global.scss";

html,
body,
#app {
  min-height: 100vh;
}

#app {
  // border-top: rem(4px) solid $brand-6;
  // border-bottom: rem(4px) solid $brand-6;

  background-color: $sky;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%23cc7847' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%23aa3e13' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%23c58134' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%239c5200' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%23b88b21' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%23876400' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%23a5960f' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%236e7200' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%238ca00a' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%234f7e00' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%236baa1d' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%2316882a' points='943 900 1210 900 971 687'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
}
</style>

<template>
  <div id="app">
    <!-- <Navigation/> -->
    <router-view/>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
export default {
  name: "app",
  // components: { Navigation }
};
</script>
