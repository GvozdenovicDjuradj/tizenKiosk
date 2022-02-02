const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")
const package = require("./package.json")

const ANDROID = "android"
const IOS = "ios"

const { name, version } = package

const ANDROID_PATH = `android${path.sep}app${path.sep}build.gradle`
const IOS_PATH = `ios${path.sep}${name}${path.sep}Info.plist`
const WEB_PATH = `web${path.sep}package.json`
const keysToUpdate = {
  [ANDROID]: {
    versionCode: "versionCode",
    versionName: "versionName"
  },
  [IOS]: {
    versionCode: "CFBundleVersion",
    versionName: "CFBundleShortVersionString"
  }
}

const webPackage = require(path.join(__dirname, WEB_PATH))

const [versionName, versionCode] = version
  .replace(/^(\d+\.\d+)\.(\d+)$/, "$1 $2")
  .split(" ")

const operations = []

operations.push(new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, ANDROID_PATH), "utf8", (err, data) => {
    if (err) {
      reject(new Error(err))
    }
    let result = data
    result = result.replace(/(versionCode) (.+)/, `$1 ${versionCode}`)
    result = result.replace(/(versionName) (".+")/, `$1 "${versionName}"`)
    fs.writeFile(path.join(__dirname, ANDROID_PATH), result, (err) => {
      if (err) {
        reject(new Error(err))
      }
      resolve()
    })
  })
}))

operations.push(new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, IOS_PATH), "utf8", (err, data) => {
    if (err) {
      reject(new Error(err))
    }
    let result = data
    const reVersionName = new RegExp(
      `(<key>${keysToUpdate[IOS].versionName}<\/key>\\s*<string>)(.+)(<\/string>)`
    )
    const reVersionCode = new RegExp(
      `(<key>${keysToUpdate[IOS].versionCode}<\/key>\\s*<string>)(.+)(<\/string>)`
    )
    result = result.replace(reVersionName, `$1${versionName}$3`)
    result = result.replace(reVersionCode, `$1${versionCode}$3`)
    fs.writeFile(path.join(__dirname, IOS_PATH), result, err => {
      if (err) {
        reject(new Error(err))
      }
      resolve()
    })
  })
}))

operations.push(new Promise((resolve, reject) => {
  webPackage.version = version
  fs.writeFile(
    path.join(__dirname, WEB_PATH),
    JSON.stringify(webPackage, null, 2),
    err => {
      if (err) {
        reject(new Error(err))
      }
      resolve()
    }
  )
}))

Promise.all(operations).then(() => {
  exec(`git add package.json ${ANDROID_PATH} ${IOS_PATH} ${WEB_PATH}`, err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
}, err => {
  console.error(err)
  process.exit(1)
})
