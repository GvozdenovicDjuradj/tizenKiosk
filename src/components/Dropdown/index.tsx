import React from "react"
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  Platform,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"
import ListItem from "./ListItem"
import { backdrop, flatList, wrapper } from "./styles"

type ViewInstance =
  & React.Component<ViewProps, React.ComponentState>
  & View



interface Props {
  data: Array<{label: string, value: string}>;
  onSelect?: (item: string) => void;
  selectedItemColor?: string;
  style?: StyleProp<ViewStyle>;
  value?: string;
}

interface State {
  left: number
  opened: boolean
  top: number
  width: number
}

export default class Dropdown extends React.Component<Props, State> {

  public container: ViewInstance | null = null
  public state = {
    left: 0,
    opened: false,
    top: 0,
    width: 0,
  }

  public toggleShowOptions = () => this.setState({ opened: !this.state.opened })

  public onPress = () => {
    if (!this.container) {
      return
    }
    const marginTop = Platform.select({
      android: 35,
      default: 10
    })
    this.container.measureInWindow((x, y, width, height) => {
      this.setState({
        left: x,
        opened: true,
        top: y + height + marginTop,
        width,
      })
    })
  }

  public selectItem = (item: string) => {
    const { onSelect } = this.props
    this.setState((state) => ({ opened: !state.opened }), () => {
      if (onSelect) {
        onSelect(item)
      }
    })
  }

  public renderItem =
    ({ item }: ListRenderItemInfo<{ key: string, label: string, value: string }>) => (
    <ListItem
      onPress={this.selectItem}
      selected={this.props.value === item.value}
      selectedColor={this.props.selectedItemColor}
      title={item.label}
    />
  )

  public render() {
    const { data = [], style, value } = this.props
    const { left, opened, top, width } = this.state
    const listStyle = { left, maxHeight: 250, top, width }
    return (
      <View
        style={[wrapper.style, style]}
        ref={(ref: ViewInstance) => this.container = ref}
      >
        <TouchableOpacity
          onPress={this.onPress}
          style={flatList.button}
        >
          <Text style={flatList.buttonText}>
            {value || "..."}
          </Text>
          <Text style={flatList.buttonIcon}>&#xf0d7;</Text>
        </TouchableOpacity>
        <Modal
          onRequestClose={this.toggleShowOptions}
          transparent
          visible={opened}
        >
          <View
            onResponderRelease={this.toggleShowOptions}
            onStartShouldSetResponder={() => true}
            collapsable={false}
            style={backdrop.view}
          >
            <View style={listStyle}>
              <FlatList
                data={data.map((item, i) => ({ key: `${i}_${item.value}`, label: item.label, value: item.value }))}
                renderItem={this.renderItem}
                style={[flatList.style]}
              />
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}
