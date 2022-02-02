const path = require("path")

const images = [
  "android-icon-144x144.png",
  "android-icon-192x192.png",
  "android-icon-36x36.png",
  "android-icon-48x48.png",
  "android-icon-72x72.png",
  "android-icon-96x96.png",
  "apple-icon-114x114.png",
  "apple-icon-120x120.png",
  "apple-icon-144x144.png",
  "apple-icon-152x152.png",
  "apple-icon-180x180.png",
  "apple-icon-57x57.png",
  "apple-icon-60x60.png",
  "apple-icon-72x72.png",
  "apple-icon-76x76.png",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "favicon-96x96.png",
  "favicon.ico",
  "ms-icon-144x144.png",
  "ms-icon-150x150.png",
  "ms-icon-310x310.png",
  "ms-icon-70x70.png",
  "icon.ico",
]

module.exports = [
  ...images.map(img => ({
    from: path.join(__dirname, "favicon_package", img),
    to: path.join(__dirname, "build", "images")
  })), {
  from: path.join(__dirname, "favicon_package", "manifest.json"),
  to: path.join(__dirname, "build")
}, {
  from: path.join(__dirname, "favicon_package", "browserconfig.xml"),
  to: path.join(__dirname, "build")
}, {
  from: path.join(__dirname, "..", "assets", "fonts", "fontawesome-regular.ttf"),
  to: path.join(__dirname, "build", "fonts")
}, {
  from: path.join(__dirname, "..", "assets", "fonts", "fontawesome-solid.ttf"),
  to: path.join(__dirname, "build", "fonts")
}, {
  from: path.join(__dirname, "index.css"),
  to: path.join(__dirname, "build", "styles")
}, {
  from: path.join(__dirname, "main.js"),
  to: path.join(__dirname, "build")
}, {
  from: path.join(__dirname, "package.json"),
  to: path.join(__dirname, "build")
}]
