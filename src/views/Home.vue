<template>
  <div class="page-home d-flex flex-column justify-content-center align-items-center p-3">
    <h1 class="h1 title d-flex align-items-center"><img class="logo d-block mr-2" src="../assets/img/ludo.svg" alt="ludo"><span>Ludo Game</span></h1>
    <div class="main-menu w-100 mt-3">
      <router-link class="btn btn-primary w-100 mb-3" to="/play">Play</router-link>
      <router-link class="btn btn-secondary w-100 mb-3" to="/about">About</router-link>
      <!-- TODO: <router-link class="btn btn-secondary w-100 mb-3" to="/software-licenses">Software Licenses</router-link> -->
    </div>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
export default {
  name: "page-home"
};
</script>

<style lang="scss" scoped>
$logo-width: rem(48px);
.title {
  margin-left: rem(-$logo-width);
  color: $dark-less;
}
.logo {
  width: rem($logo-width);
  height: rem($logo-width);
  border-radius: $border-radius;
}
.main-menu {
  max-width: rem(480px);
  margin: auto;
}
</style>

