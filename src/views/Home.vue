<template>
  <div class="wrapper d-flex justify-content-center align-items-center overflow-auto">
    <div class="inner w-100 rounded mx-auto d-flex h-75 justify-content-center align-items-center">
      <div class="d-flex flex-column justify-content-center align-items-center p-3 w-100">
        <h1 class="h1 title d-flex align-items-center font-weight-light">
          <span>Ludo Game</span></h1>
        <div class="nav d-flex flex-column justify-content-center align-items-center w-100 mt-4">
          <router-link class="btn btn-lg w-75 btn-primary mb-3 font-weight-bolder rounded-pill shadow-sm" to="/play">Play</router-link>
          <router-link class="btn btn-lg w-75 btn-secondary mb-3 font-weight-normal rounded-pill shadow-sm" to="/about">About</router-link>
          <!-- TODO: <router-link class="btn btn-secondary w-100 mb-3" to="/software-licenses">Software Licenses</router-link> -->
        </div>
      </div>
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
$logo-width: 48px;
.wrapper {
  max-width: rem($board-width);
  height: 100vh;
  margin: auto;
}
.inner {
  min-height: rem(300px);
}
.title {
  color: $dark;
}
.logo {
  width: rem($logo-width);
  height: rem($logo-width);
  border-radius: $border-radius;
}
.btn {
  text-transform: uppercase;
}

</style>

