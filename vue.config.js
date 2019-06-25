module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === "production" ? "/ludo/" : "/",
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/global-ghost.scss";`
      }
    }
  }
};
