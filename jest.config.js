module.exports = {
  preset: "react-native",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "ts", "tsx"],
  modulePathIgnorePatterns: [
    "<rootDir>[/\\\\](web|ios|android|coverage)[/\\\\]"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/jest/assetsTransformer.js"
  },
  moduleDirectories: [
    "node_modules",
    "src",
    "__tests__"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: ["**/__tests__/(**)?.+(test|spec)\\.(ts|tsx)"],
  testPathIgnorePatterns: [
    "\\.snap$",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$",
    "<rootDir>/node_modules/",
    "<rootDir>/jest/",
    "<rootDir>/web/"
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|rn-fetch-blob|react-native-picker-select|react-native-star-prnt|react-navigation|react-native-keyboard-aware-scroll-view|react-native-check-box|react-native-simple-radio-button|react-native-iphone-x-helper)/)"
  ],
  globals: {
    "ts-jest": {
      babelConfig: true,
      diagnostics: false
    },
    "__DEV__": true
  },
  rootDir: ".",
  setupFiles: [
    "<rootDir>/jest/enzymeSetup.js",
    "<rootDir>/jest/setup.js"
  ]
}
