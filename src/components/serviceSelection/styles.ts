import { StyleSheet } from "react-native"

export default StyleSheet.create({
  navView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  backgroundImage: {
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: -1,
  },
  mainView: {
    alignItems: "center",
    flex: 1,
  },
  logo: {
    height: 60,
    width: 300,
    zIndex: -1,
  },
  flexProductsWrapper: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    width: "100%",
  },
  productsView: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    width: "100%",
  },
  bottomView: {
    alignItems: "flex-end",
    flexDirection: "row",
    height: 80,
    justifyContent: "center",
    width: "100%",
  },
  qudiniLogoView: {
    alignItems: "center",
    height: 80,
    justifyContent: "center",
    marginRight: 60,
    width: 180,
  },
  qudiniLogo: {
    height: 50,
    width: 170,
    resizeMode: "contain"
  },
})
