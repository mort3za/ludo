<style lang="scss">
@import '@/styles/global.scss';

html,
body,
#app {
  min-height: 100vh;
}

#app {
  background: url('./assets/img/bg-mountains.png') bottom center $sky no-repeat;
  background-attachment: fixed;
  background-size: auto 48vh;
}
</style>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>
