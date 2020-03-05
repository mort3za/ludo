<template>
  <div class="page-text shadow-sm">
    <div class="container py-4">
      <h1 class="h1 font-weight-light pb-3 mb-3 border-bottom">Ludo Game</h1>
      <p>
        This is a free and open source software. The source code is available at
        <a href="https://github.com/mort3za/ludo">Github</a>. Please feel free to send pull requests or create an issue.
      </p>
      <p>
        Made with
        <span class="heart d-inline-block mx-2 h4">♥</span> by <a href="https://github.com/mort3za">Morteza Ziyae</a> in
        Tehran, Iran.
      </p>
      <p>
        Contact me on <a target="_blank" rel="me noreferrer noopener" href="https://t.me/mort3za">Telegram</a> or
        <a rel="me noreferrer noopener" target="_blank" href="https://twitter.com/mort3za">Twitter</a>.
      </p>
      <hr />
      <router-link class="btn btn-lg btn-primary px-4" to="/">Back</router-link>
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
