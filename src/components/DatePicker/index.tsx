import React from "react"
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import Picker from "react-native-wheel-picker"
import moment from "moment"
import styles from "./styles"

/** current year */
const y = moment().year()
const RANGE = 50
const yearsRange = Array.from({ length: RANGE }, (_v, i: number) => (
  y + i - RANGE / 2
))
const months = moment.months()

export interface DatePickerProps {
  itemStyle?: StyleProp<TextStyle>;
  onDateChange?: (date: Date) => void;
  style?: StyleProp<ViewStyle>;
  value?: Date;
}

export default class DatePicker extends React.Component<DatePickerProps> {

  public onDayChange = (value: string | number) => {
    const day = +value
    const date = moment(this.props.value).date(day).toDate()
    this.onDateChange(date)
  }

  public onMonthChange = (value: string | number) => {
    const month = value.toString()
    const date = moment(this.props.value).month(month).toDate()
    this.onDateChange(date)
  }

  public onYearChange = (value: string | number) => {
    const year = +value
    const date = moment(this.props.value).year(year).toDate()
    this.onDateChange(date)
  }

  public onDateChange = (newDate: Date) => {
    if (this.props.onDateChange) {
      this.props.onDateChange(newDate)
    }
  }

  public render() {
    const { itemStyle, style, value } = this.props
    const currentDate = moment(value || new Date())
    const days = currentDate.daysInMonth()
    const date = currentDate.date()
    const month = currentDate.month()
    const year = currentDate.year()
    return (
      <View style={[styles.wrapper, style]}>
        <Picker
          style={styles.picker}
          itemStyle={StyleSheet.flatten([styles.pickerItem, itemStyle])}
          selectedValue={date}
          onValueChange={this.onDayChange}
        >
          {Array.from({ length: days }, (_v, i) => (
            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
          ))}
        </Picker>
        <Picker
          style={styles.pickerWide}
          itemStyle={StyleSheet.flatten([styles.pickerItem, itemStyle])}
          selectedValue={months[month]}
          onValueChange={this.onMonthChange}
        >
          {months.map((_month, i) => (
            <Picker.Item key={i} label={_month} value={_month} />
          ))}
        </Picker>
        <Picker
          style={styles.picker}
          itemStyle={StyleSheet.flatten([styles.pickerItem, itemStyle])}
          selectedValue={year}
          onValueChange={this.onYearChange}
        >
          {yearsRange.map((_year, i) => (
            <Picker.Item key={i} label={`${_year}`} value={_year} />
          ))}
        </Picker>
      </View>
    )
  }

}
