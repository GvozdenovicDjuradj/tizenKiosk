import { Platform, StyleSheet } from "react-native"

const FLEX_START = "flex-start"
const FLEX_END = "flex-end"

export const main = StyleSheet.create({
  backgroundImage: {
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: -1,
  },
  bottomView: {
    alignItems: FLEX_END,
    flexDirection: "row",
    height: 80,
    justifyContent: "center",
    width: "100%",
  },
  logo: {
    height: 60,
    width: 300,
    zIndex: 0,
  },
  navView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  navButton: {
    alignItems: "center",
    backgroundColor: "#c5383a",
    borderRadius: 2,
    borderWidth: 1,
    elevation: 5,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 10,
    shadowOffset: {  width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  navButtonLeft: {
    marginLeft: 20,
    alignSelf: FLEX_START,
  },
  navButtonRight: {
    marginRight: 20,
    alignSelf: FLEX_END,
  },
  qudiniLogoView: {
    alignItems: FLEX_END,
    bottom: 15,
    justifyContent: "center",
    position: "absolute",
    right: 50,
  },
  qudiniLogo: {
    height: 50,
    width: 170,
    resizeMode: "contain"
  },
  view: {
    alignItems: "center",
    flex: 1,
  },
})

export const content = StyleSheet.create({
  componentView: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  faRegular: {
    fontFamily: Platform.OS === "ios" ? "FontAwesome5FreeRegular" : "fontawesome-regular",
    textAlign: "center",
  },
  faSolid: {
    fontFamily: Platform.OS === "ios" ? "FontAwesome5FreeSolid" : "fontawesome-solid",
    textAlign: "center",
  },
  textFieldView: {
    flexDirection: "row",
    maxHeight: "75%",
    width: "50%",
  },
  wrapper: {
    alignItems: "stretch",
    flex: 3,
    paddingHorizontal: 50,
    paddingTop: 40,
    width: "100%",
  },
})

export const checkbox = StyleSheet.create({
  contentContainer: {
    alignItems: FLEX_START,
    alignSelf: "center",
    justifyContent: "center",
    width: "50%",
  },
  style: {
    flex: 1,
    padding: 15,
    width: "100%",
  },
  scrollView: {
    flex: 1,
    width: "50%",
  },
  textStyle: {
    fontSize: 26,
  },
})

export const date = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
  },
  buttonView: {
    alignItems: "center",
    borderColor: "#dfdfdf",
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    padding: 10,
    width: "50%",
  },
  current: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  datepickerView: {
    borderColor: "#e6e6e6",
    borderWidth: 1,
    flexDirection: "row",
    width: "50%",
  },
})

export const radio = StyleSheet.create({
  contentContainer: {
    alignItems: FLEX_START,
    alignSelf: "center",
    justifyContent: "center",
    width: "50%",
  },
  itemView: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  labelStyle: {
    fontSize: 26,
    lineHeight: 39,
    paddingRight: 30,
  },
  labelWrapStyle: {
    flex: 1,
  },
  buttonWrapStyle: {
    width: 30,
  },
  scrollView: {
    flex: 1
  },
})

export const rating = StyleSheet.create({
  star: {
    fontSize: 52,
    marginHorizontal: 10,
  },
  starsView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 25,
  },
})

export const dropdown = StyleSheet.create({
  component: {
    borderRadius: 4,
    borderWidth: 1,
  },
  view: {
    flexDirection: "row",
    width: "50%",
  },
})

export const other = StyleSheet.create({
  view: {
    backgroundColor: "#fff",
    flex: 0.5,
    marginTop: 20,
    width: "50%",
  }
})
