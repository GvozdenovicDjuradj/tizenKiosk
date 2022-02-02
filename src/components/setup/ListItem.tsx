import React, { Component } from "react"
import { Text, View } from "react-native"
import { font } from "./styles"

export interface RegistrationStepItem {
  key: string;
  title: string;
  children?: RegistrationStepItem[];
}

interface Props {
  item: RegistrationStepItem;
}

enum BulletType {
  ONE = "\u2022",
  TWO = "\t\t\u25E6",
}

export default class ListItem extends Component<Props> {
  public render(): JSX.Element {
    const { item } = this.props
    let children
    if (item.children && item.children.length) {
      children = this.renderChildren(item.children)
    }
    return (
      <View>
        <Text style={font}>{BulletType.ONE} {item.title}</Text>
        {children}
      </View>
    )
  }

  private renderChildren(children: RegistrationStepItem[]) {
    const items = children.map((child: RegistrationStepItem, i: number) => (
      <Text key={i} style={font}>{BulletType.TWO} {child.title}</Text>
    ))
    return (
      <View>{items}</View>
    )
  }
}
