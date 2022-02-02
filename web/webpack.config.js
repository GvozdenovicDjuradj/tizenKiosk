const path = require("path")
const glob = require("glob")
const webpack = require("webpack")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin")
const vendorConfig = require("./vendor.webpack.config")
const sharedConfig = require("./shared.webpack.config")
const copyConfig = require("./copy-resources")
const package = require("../app.json")

const outputPath = "build"

const addAssetHtmlFiles = () => (
  Object.keys(vendorConfig.entry).map((name) => {
    const fileGlob = `${name}*.dll.js`
    const paths = glob.sync(path.join(vendorConfig.output.path, fileGlob))
    if (paths.length === 0) {
      throw new Error(`Could not find ${fileGlob}!`)
    }
    if (paths.length > 1) {
      throw new Error(
        `Too many files for ${fileGlob}! You should clean and rebuild.`
      )
    }
    return {
      filepath: require.resolve(paths[0]),
      includeSourcemap: false,
      outputPath: "",
      publicPath: "javascript",
    }
  })
)

const __DEV__ = process.env.NODE_ENV === "development"

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    __DEV__,
  }),
  ...Object.keys(vendorConfig.entry).map(name =>
    new webpack.DllReferencePlugin({
      manifest: path.join(vendorConfig.output.path, `${name}-manifest.json`),
    })
  ),
  new HtmlWebpackPlugin({
    filename: "../index.html",
    template: path.join(__dirname, "index.ejs"),
    title: package.displayName,
  }),
  new CopyWebpackPlugin(copyConfig),
  new AddAssetHtmlPlugin(addAssetHtmlFiles()),
  ...(__DEV__ ? [] : sharedConfig.productionPlugins)
]

module.exports = {
  entry: __DEV__ ? [
    `webpack-dev-server/client?http://${process.env.HOST}:${process.env.PORT}`,
    path.resolve(__dirname, "..", "src", "index.tsx"),
  ] : path.resolve(__dirname, "..", "src", "index.tsx"),

  // Enable sourcemaps for debugging webpack's output.
  devtool: __DEV__ ? "source-map" : false,

  mode: process.env.NODE_ENV,

  module: {
    rules: [
      ...sharedConfig.rules,
      __DEV__ ?
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" } :
      { },
    ]
  },

  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, outputPath, "javascript"),
    publicPath: "javascript",
  },

  plugins,

  resolve: {
    alias: {
      "react-native$": path.resolve(__dirname, "ReactNative"),
      "react-native-wheel-picker": path.resolve(
        __dirname, "..", "src", "components", "WebWheelPicker"
      ),
      "react-native-check-box": path.resolve(
        __dirname, "..", "src", "components", "WebCheckbox"
      )
    },
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  stats: "verbose",
}
