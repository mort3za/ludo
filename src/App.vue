<style lang="scss">
@import "@/styles/global.scss";
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
