<template>
  <div class="page-text shadow-sm">
    <div class="container py-3">
      <h1 class="h1 font-weight-light">Ludo Game</h1>
      <p>
        This is a free and open source software. The source code is available at
        <a href="https://github.com/mort3za/ludo">Github</a>. Please feel free to send pull requests or create an issue.
      </p>
      <p>
        Made with
        <span class="heart d-inline-block mx-2 h4">♥</span> by
        <a href="https://github.com/mort3za">Morteza Ziyae</a> in Tehran, Iran.
      </p>

      <router-link class="btn btn-primary" to="/">Back</router-link>
    </div>
  </div>
</template>

<style lang="scss">
.heart {
  animation: 1s heartbeat infinite;
  color: $danger;
  line-height: rem(24px);
}
</style>
