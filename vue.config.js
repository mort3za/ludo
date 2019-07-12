const webpack = require("webpack");

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === "production" ? "/ludo/" : "/",
  pwa: {
    // service worker guides:
    // https://levelup.gitconnected.com/vue-pwa-example-298a8ea953c9
    // https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    },
    name: "Ludo Game",
    themeColor: "#00ffbb",
    msTileColor: "#2c3939",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#2c3939",
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon.png",
      msTileImage: "img/icons/mstile-144x144.png"
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          APP_VERSION: '"' + escape(JSON.stringify(require("./package.json").version)) + '"',
          BUILD_DATE: new Date().getTime()
        }
      })
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/global-ghost.scss";`
      }
    }
  }
};
