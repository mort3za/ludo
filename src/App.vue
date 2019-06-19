<style lang="scss">
@import "@/styles/global.scss";

html,
body,
#app {
  min-height: 100vh;
}

#app {
  border-top: rem(4px) solid $brand-6;
  border-bottom: rem(4px) solid $brand-6;
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
