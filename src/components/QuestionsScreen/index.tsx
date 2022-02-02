import React from "react"
import { Dispatch } from "redux"
import { Image, ImageStyle, View } from "react-native"
import { connect } from "react-redux"
import Content from "./Content"
import Header from "../Header"
import TopBar from "../TopBar"
import { NavButtonBack, NavButtonNext } from "../NavButton"
import ComponentWithNavigation, { ComponentWithNavigationProps } from "../ComponentWithNavigation"
import KeyboardResponsiveScrollView from "../keyboard/KeyboardResponsiveScrollView"
import {
  AppScreens,
  KioskTemplate,
  Language,
  Question,
  QuestionAnswer,
  RootState,
} from "../../interfaces"
import { getLocaleString, getTemplateStyles, selectors, getTemplateBackground } from "../../utils"
import { Action, KIOSK, QUESTIONS } from "../../actions/types"
import { setAddCustomerToQueueError } from "../../actions/kiosk"
import { main } from "./styles"
import SecretTap from "../secretTap"
import { getQuestionText } from "./utils"
import { getCurrentLanguageCode } from "../../utils/selectors"

interface PropsFromState {
  languageCode?: string;
  current: number;
  error?: string;
  locale?: Language;
  question?: Question;
  screenValid: boolean;
  showFieldForOther: boolean;
  showQudiniLogo: boolean;
  template?: KioskTemplate;
  total: number;
  url: string;
  value?: string;
  isFetching: boolean;
}

interface PropsFromDispatch {
  answerQuestion: (data: QuestionAnswer) => Action;
  dispatch: Dispatch<Action>;
  toggleOther: (payload: QuestionAnswer) => Action;
  emptyFieldsError: () => void;
}

interface PropsFromMerge {
  goBackExtra: () => any;
  goNext: () => any;
}

type Props = PropsFromState & PropsFromDispatch & PropsFromMerge & ComponentWithNavigationProps



class QuestionsScreen extends ComponentWithNavigation<Props> {
  public render() {
    const {
      answerQuestion,
      goNext,
      question,
      screenValid,
      showFieldForOther,
      showQudiniLogo,
      template,
      toggleOther,
      url,
      value,
      languageCode
    } = this.props
    const templateStyles = getTemplateStyles(template, url)
    const templateBackground = getTemplateBackground(template, url)
    const headerText = question
      ? `${getQuestionText(question, languageCode)}${
          question.isAnswerMandatory ? " *" : ""
        }`
      : "";
    return (
      <KeyboardResponsiveScrollView
        contentContainerStyle={[main.view, templateBackground.color]}
      >
        <TopBar>
          <View style={main.navView}>
            <View style={{ flex: 1 }}>
              <NavButtonBack
                buttonColor={templateStyles.circle.backgroundColor}
                onPress={this.goBack}
                text={getLocaleString("customerScreen.navigation.previous")}
                textColor={templateStyles.text.color}
              />
            </View>
            <SecretTap />
            {templateStyles.logo ? (
              <Image
                resizeMode="contain"
                source={{ uri: templateStyles.logo }}
                style={main.logo as ImageStyle}
              />
            ) : null}
            <View style={{ flex: 1 }}>
              <NavButtonNext
                disabled={this.props.isFetching}
                buttonColor={templateStyles.circle.backgroundColor}
                onPress={screenValid ? goNext : this.props.emptyFieldsError}
                text={getLocaleString("customerScreen.navigation.next")}
                textColor={templateStyles.text.color}
              />
            </View>
          </View>
        </TopBar>
        <Header
          style={{ marginTop: 0 }}
          template={template}
          text={headerText}
        />
        {question ? (
          <Content
            onChange={(text?: string, showOther?: boolean) => answerQuestion({
              questionId: question.id, showOther, text,
            })}
            showFieldForOther={showFieldForOther}
            toggleShowOther={() => toggleOther({ questionId: question.id })}
            template={template}
            question={question}
            url={url}
            value={value}
            languageCode={languageCode}
          />
        ) : null}
        <View style={main.bottomView}>
          <View style={{ flex: 1 }} />
          {showQudiniLogo ? (
            <View style={main.qudiniLogoView}>
              <Image
                source={require("../../../assets/images/logo-qudini.png")}
                style={main.qudiniLogo as ImageStyle}
              />
            </View>
          ) : null}
        </View>
        {templateBackground.image.url ? (
          <Image
            resizeMode="contain"
            style={main.backgroundImage as ImageStyle}
            source={{ cache: "force-cache", uri: templateBackground.image.url }}
          />
        ) : null}
      </KeyboardResponsiveScrollView>
    )
  }
}

const mapStateToProps = (state: RootState): PropsFromState => {
  const { current, questions } = state.questions
  const question = questions[current]
  const answer = question && state.answers.find((q) =>
    q.questionId === question.id
  )
  const value = answer && answer.text
  const { isAnswerMandatory = false } = question || {}
  const screenValid = isAnswerMandatory ? Boolean(value && value.trim()) : true
  const showFieldForOther = Boolean(answer && answer.showOther)
  return {
    languageCode: getCurrentLanguageCode(state),
    current,
    error: state.questions.error,
    locale: state.kiosk.language,
    question,
    screenValid,
    showFieldForOther,
    showQudiniLogo: selectors.showQudiniLogo(state),
    template: state.kiosk.settings && state.kiosk.settings.template,
    total: questions.length,
    url: state.kiosk.fields.url,
    value,
    isFetching: state.kiosk.isAddingCustomerToQueue,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>): PropsFromDispatch => ({
  answerQuestion: (payload: QuestionAnswer) => dispatch({
    type: QUESTIONS.ANSWERED, payload
  }),
  dispatch,
  toggleOther: (payload: QuestionAnswer) => dispatch({
    type: QUESTIONS.TOGGLE_OTHER, payload
  }),
  emptyFieldsError: () => dispatch(setAddCustomerToQueueError(getLocaleString("welcomeScreen.error.kiosk.input") || "Please enter the required information"))
})

const mergeProps = (
  stateProps: PropsFromState,
  dispatchProps: PropsFromDispatch,
  ownProps: ComponentWithNavigationProps) => {
  const { answerQuestion, dispatch, toggleOther, emptyFieldsError } = dispatchProps
  return {
    ...stateProps,
    ...ownProps,
    answerQuestion,
    toggleOther,
    emptyFieldsError,
    goBackExtra: () => stateProps.current === 0 ?
      dispatch({ type: QUESTIONS.ANSWERS.RESET }) :
      dispatch({
        type: QUESTIONS.SET_CURRENT,
        payload: stateProps.current - 1
      })
    ,
    goNext: () => {
      const { current, question, showFieldForOther, total, value } = stateProps
      if (question) {
        dispatch({
          type: QUESTIONS.ANSWERED,
          payload: {
            questionId: question.id,
            showOther: showFieldForOther,
            text: value,
          }
        })
      }
      if (current + 1 < total) {
        ownProps.navigation.push(
          AppScreens.QUESTIONS,
          { key: `${AppScreens.QUESTIONS}_${current + 1}` },
        )
        dispatch({ type: QUESTIONS.SET_CURRENT, payload: current + 1 })
      } else {
        dispatch({ type: KIOSK.CUSTOMER.ADD_TO_QUEUE.REQUEST })
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(QuestionsScreen)
