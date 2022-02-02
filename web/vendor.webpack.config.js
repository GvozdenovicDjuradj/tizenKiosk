const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require("clean-webpack-plugin")
const config = require('./shared.webpack.config')

const __DEV__ = process.env.NODE_ENV === "development"
const outputPath = path.resolve(__dirname, "build", "javascript")
const outputFilename = __DEV__ ? "[name].dll.js" : "[name]-[hash:8].dll.js"

const plugins = [
  new CleanWebpackPlugin(path.join(__dirname, "build")),
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    __DEV__,
  }),

  ...(__DEV__ ? [] : config.productionPlugins),

  new webpack.DllPlugin({
    name: '[name]',
    path: path.join(outputPath, '[name]-manifest.json'),
  }),
]

module.exports = {
  entry: {
    // Put react-native-web / react dependencies in here.
    "react": [
      "react-native-web",
      "react-redux",
      "redux-persist",
      "react-navigation",
      "redux-persist/es/integration/react.js",
    ],
  },
  output: {
    filename: outputFilename,
    path: outputPath,
    library: '[name]',
  },

  mode: process.env.NODE_ENV,

  module: {
    rules: config.rules,
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "react",
          chunks: "all"
        }
      }
    }
  },

  plugins,
  resolve: {
    alias: {
      "react-native$": path.resolve(__dirname, "ReactNative"),
    },
    extensions: [".web.js", ".js", ".json"],
  },

  stats: "verbose",
}
