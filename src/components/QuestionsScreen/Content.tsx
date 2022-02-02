import React from "react"
import { Animated, ScrollView, Text, TouchableOpacity, View } from "react-native"
import moment from "moment"
import { RadioButtonInput, RadioButtonLabel } from "react-native-simple-radio-button"
import CheckboxesWrapper from "./CheckboxesWrapper"
import DatePicker from "../DatePicker"
import Dropdown from "../Dropdown"
import TextField from "../TextField"
import { KioskTemplate, Question, TemplateStyles } from "../../interfaces"
import { getTemplateStyles } from "../../utils"
import { content, date, dropdown, radio, rating, other } from "./styles"
import { getQuestionAnswerList, getQuestionAnswerText } from './utils'

interface Props {
  onChange: (text: string, showOther?: boolean) => void;
  question: Question;
  showFieldForOther: boolean;
  template?: KioskTemplate;
  toggleShowOther: () => void;
  url: string;
  value?: string;
  languageCode?: string;
}

interface State {
  showDatepicker: boolean;
}

const getFieldForOther = (handler: (text: string, other: boolean) => void, value?: string) => (
  <View style={other.view}>
    <TextField
      multiline
      name="answer_text_other"
      numberOfLines={3}
      onChangeText={(text: string) => handler(text, true)}
      value={value}
    />
  </View>
)

export default class Content extends React.PureComponent<Props, State> {

  public _opacity = new Animated.Value(0)
  public state = { showDatepicker: false }

  public toggleDatepicker = () => {
    const { showDatepicker } = this.state
    const { onChange, value } = this.props
    this.setState(() => ({ showDatepicker: !showDatepicker }), () => {
      const toValue = showDatepicker ? 0 : 1
      Animated.timing(this._opacity, { toValue }).start()
      if (!showDatepicker && !value) {
        onChange(new Date().toJSON())
      }
    })
  }

  public datepicker = (templateStyles: TemplateStyles) => {
    const { onChange, value } = this.props
    return (
      <View style={content.componentView}>
        <View style={[date.buttonView, templateStyles.circle]}>
          <TouchableOpacity style={date.button} onPress={this.toggleDatepicker}>
            <Text style={[templateStyles.text, content.faSolid, { fontSize: 26 }]}>
              &#xf073;
            </Text>
          </TouchableOpacity>
          <View style={date.current}>
            <Text style={[templateStyles.text, { fontSize: 26 }]}>
              {value ? moment(value).format("D MMM YYYY") : " "}
            </Text>
          </View>
          <TouchableOpacity style={date.button} onPress={() => onChange("")}>
            <Text style={[templateStyles.text, content.faSolid, { fontSize: 26 }]}>
              &#xf00d;
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={[date.datepickerView, { opacity: this._opacity }]}>
          <DatePicker
            itemStyle={{ color: templateStyles.text.color }}
            onDateChange={(d: Date) => onChange(d.toJSON())}
            style={templateStyles.circle}
            value={value ? moment(value).toDate() : undefined}
          />
        </Animated.View>
      </View>
    )
  }

  public textField = () => {
    const { onChange, value } = this.props
    return (
      <View style={content.componentView}>
        <View style={content.textFieldView}>
          <TextField
            multiline
            name="answer_text"
            onChangeText={onChange}
            value={value}
          />
        </View>
      </View>
    )
  }

  public radioButtons = (templateStyles: TemplateStyles) => {
    const {
      onChange,
      question,
      showFieldForOther,
      toggleShowOther,
      value,
      languageCode
    } = this.props
    const color = templateStyles.circle.backgroundColor
    const labelStyle = [
      radio.labelStyle,
      { fontFamily: templateStyles.text.fontFamily }
    ]
    const handler = (val: string | number) => onChange(val as string)
    return (
      <View style={[content.componentView]}>
        <ScrollView
          style={radio.scrollView}
          contentContainerStyle={radio.contentContainer}
        >
          {getQuestionAnswerList(question, languageCode).map((answer, i) => {
            const option = { label: getQuestionAnswerText(question, answer, languageCode), value: answer };
            return (
              <View style={radio.itemView} key={`${i}_${answer}`}>
                <RadioButtonInput
                  buttonInnerColor={color}
                  buttonOuterColor={color}
                  buttonWrapStyle={radio.buttonWrapStyle}
                  isSelected={answer === value}
                  obj={option}
                  onPress={handler}
                />
                <RadioButtonLabel
                  labelHorizontal
                  labelStyle={labelStyle}
                  labelWrapStyle={radio.labelWrapStyle}
                  obj={option}
                  onPress={handler}
                />
              </View>
            )
          })}
          {question.isOptionForOther ? (
            <View style={radio.itemView}>
              <RadioButtonInput
                buttonInnerColor={color}
                buttonOuterColor={color}
                buttonWrapStyle={radio.buttonWrapStyle}
                isSelected={showFieldForOther}
                obj={{ label: "Other", value: "OTHER" }}
                onPress={toggleShowOther}
              />
              <RadioButtonLabel
                labelHorizontal
                labelStyle={labelStyle}
                labelWrapStyle={radio.labelWrapStyle}
                obj={{ label: "Other", value: "OTHER" }}
                onPress={toggleShowOther}
              />
            </View>
          ) : null}
        </ScrollView>
        {showFieldForOther ? getFieldForOther(onChange, value) : null}
      </View>
    )
  }

  public dropdown = (templateStyles: TemplateStyles) => {
    const {
      onChange,
      question,
      showFieldForOther,
      toggleShowOther,
      value,
      languageCode
    } = this.props;
    const color = templateStyles.circle.backgroundColor;
    const handler = (text: string) => {
      if (text !== "Other") {
        onChange(text)
      } else {
        toggleShowOther()
      }
    };
    const answerList = getQuestionAnswerList(question, languageCode)
    const data = (question.isOptionForOther
      ? [...answerList, "Other"]
      : answerList
    ).map((item) => ({
      label: getQuestionAnswerText(question, item, languageCode),
      value: item,
    }));
    return (
      <View style={content.componentView}>
        <View style={dropdown.view}>
          <Dropdown
            data={data}
            onSelect={handler}
            selectedItemColor={color}
            style={[dropdown.component, { borderColor: color }]}
            value={showFieldForOther ? "Other" : value}
          />
        </View>
        {showFieldForOther ? getFieldForOther(onChange, value) : null}
      </View>
    )
  }

  public checkbox = (templateStyles: TemplateStyles) => {
    const { onChange, question, value, languageCode } = this.props;
    const color = templateStyles.circle.backgroundColor;
    const { fontFamily } = templateStyles.text;
    return (
      <View style={content.componentView}>
        <CheckboxesWrapper
          checkBoxColor={color}
          onChange={onChange}
          options={getQuestionAnswerList(question, languageCode).map((item) => ({
            label: getQuestionAnswerText(question, item, languageCode),
            value: item,
          }))}
          textStyle={{ fontFamily }}
          value={value}
        />
      </View>
    )
  }

  public rating = (templateStyles: TemplateStyles) => {
    const { onChange, question, value } = this.props
    const rate = value ? +value : 0
    const color = templateStyles.circle.backgroundColor
    return (
      <View style={content.componentView}>
        <View style={rating.starsView}>
          {Array.from({ length: question.ratingScale }, (_v, i) => (
            <TouchableOpacity key={i} onPress={() => onChange(`${i + 1}`)}>
              <Text style={[
                rating.star,
                i < rate ? [content.faSolid, { color }] : content.faRegular
              ]}>
                &#xf005;
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  public numberField = () => {
    const { onChange, value } = this.props;

    const onChangeHandler = (text: string) => onChange(text.replace(/[^0-9]/g, ""))

    return (
      <View style={content.componentView}>
        <View style={content.textFieldView}>
          <TextField
            keyboardType="numeric"
            name="answer_number"
            onChangeText={onChangeHandler}
            value={value}
          />
        </View>
      </View>
    )
  }

  public getComponent() {
    const { template, question, url } = this.props
    const templateStyles = getTemplateStyles(template, url)
    switch (question.answerType) {
      case "DATE":
        return this.datepicker(templateStyles)
      case "FREE_TEXT":
        return this.textField()
      case "MULTIPLE_CHOICE":
        return this.radioButtons(templateStyles)
      case "DROPDOWN":
        return this.dropdown(templateStyles)
      case "CHECK_BOX":
        return this.checkbox(templateStyles)
      case "RATING":
        return this.rating(templateStyles)
      case "NUMBER":
        return this.numberField()
      default: {
        return <Text>Unknown answer type</Text>
      }
    }
  }

  public render() {
    return (
      <View style={content.wrapper}>
        {this.getComponent()}
      </View>
    )
  }

}
