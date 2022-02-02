const path = require("path")

const htmlLoaderConfig = {
  test: /\.(html)$/,
  use: {
    loader: 'html-loader',
    options: {
    }
  }
}

const jsLoaderConfig = {
  test: /\.js$/,
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      presets: [require("metro-react-native-babel-preset")],
      plugins: [require("@babel/plugin-proposal-class-properties")]
    }
  }
}

const tsLoaderConfig = {
  test: /\.tsx?$/,
  include: path.resolve(__dirname, "..", "src"),
  use: [{
    loader: "babel-loader"
  }, {
    loader: "ts-loader",
    options: { transpileOnly: true }
  }]
}

const urlLoaderConfig = {
  test: /\.(gif|jpe?g|png|svg|ttf)$/,
  use: {
    loader: "url-loader",
    options: {
      name: '[name].[ext]'
    }
  }
}

module.exports = {
  productionPlugins: [
  ],
  rules: [
    htmlLoaderConfig,
    jsLoaderConfig,
    tsLoaderConfig,
    urlLoaderConfig,
  ]
}
