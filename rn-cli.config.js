const blacklist = require("metro-config/src/defaults/blacklist")

module.exports = {
  resolver: {
    blacklistRE: blacklist([/^((?<!node_modules).)*web\/.*/]),
    sourceExts: ["js", "ts", "tsx"]
  },
  transformer: {
    babelTransformerPath: require.resolve("react-native-typescript-transformer")
  },
};
