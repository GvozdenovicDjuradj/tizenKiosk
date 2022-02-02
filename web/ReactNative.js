class DeviceEventEmitter {
  static addListener(type, listener, context) {
    return {
      remove: () => undefined
    }
  }
  static removeListener(eventType, listener) {
    return
  }
}

module.exports = {
  ...require("react-native-web"),
  DeviceEventEmitter,
  Alert: require("../src/components/WebAlert/index.tsx").default,
  Modal: require("../src/components/WebModal/index.tsx").default,
}
