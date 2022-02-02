const path = require("path")
const webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")

const compile = config => new Promise((resolve, reject) => {
  const compiler = webpack({
    ...config, plugins: [
      ...config.plugins,
      new webpack.ProgressPlugin()
    ]
  }, (err, stats) => {
    console.log(stats.toString({ colors: true }))
    if (err || (stats && stats.hasErrors())) {
      console.error("Error occurred")
      return reject(new Error())
    }
    resolve(compiler)
  })
})

let {
  HOST,
  NODE_ENV,
  PORT,
} = process.env

const command = process.argv[2]
if (command) {
  switch (command) {
    case "build": {
      if (!NODE_ENV) {
        process.env.NODE_ENV = "production"
      }
      return compile(require("./vendor.webpack.config")).then(() => {
        compile(require("./webpack.config")).then(() => {
          console.log("Done")
        })
      }).catch(e => console.error(e.message))
    }
    case "watch": {
      if (!NODE_ENV) {
        process.env.NODE_ENV = "development"
      }
      if (!HOST) {
        HOST = "0.0.0.0"
        process.env.HOST = HOST
      }
      if (!PORT) {
        PORT = 3000
        process.env.PORT = PORT
      }
      return compile(require("./vendor.webpack.config")).then(() => {
        compile(require("./webpack.config")).then(compiler => {
          const devServerOptions = {
            contentBase: path.join(__dirname, "build"),
            host: HOST,
            hot: true,
            inline: true,
            port: PORT,
            progress: true,
            stats: {
              colors: true
            }
          }
          const server = new WebpackDevServer(compiler, devServerOptions)
          server.listen(PORT, HOST, () => {
            console.log(`\r\nServer listening on http://${HOST}:${PORT}\r\n`);
          })
        })
      }).catch(e => console.error(e.message))
    }
    default: {
      process.stderr.write(`Unknown command: ${command}\r\n`)
    }
  }
} else {
  console.error("No command provided. Exiting.");
}

