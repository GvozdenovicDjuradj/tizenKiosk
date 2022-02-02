import {
    ViewStyle
} from "react-native"

const dimensions = (t: any, r = t, b = t, l = r, property: string) => {
    const styles: {[propName: string]: any} = {}
    styles[`${property}Top`] = t
    styles[`${property}Right`] = r
    styles[`${property}Bottom`] = b
    styles[`${property}Left`] = l
    return styles
}

const center = (flex?: boolean) => {
    const styles: ViewStyle = {}
    styles.alignItems = "center"
    styles.justifyContent = "center"
    if (flex) {
        styles.flex = 1
    }

    return styles
}

const borderItem = (width: number, color: string, position?: string) => {
    const styles: {[propName: string]: any} = {}
    if (position) {
        styles[`border${position
                .charAt(0)
                .toUpperCase() + position.slice(1)}Width`] = width
        styles[`border${position
                .charAt(0)
                .toUpperCase() + position.slice(1)}Color`] = color
    } else {
        styles[`borderWidth`] = width
        styles[`borderColor`] = color
    }

    return styles
}

const borderRadiusItem = (tl: number, tr = tl, br = tl, bl = tr) => {
    const styles: ViewStyle = {}
    styles.borderTopLeftRadius = tl
    styles.borderTopRightRadius = tr
    styles.borderBottomRightRadius = br
    styles.borderBottomLeftRadius = bl

    return styles
}

const boxShadow = (
    color: any,
    offsetWidth: any,
    offsetHeight: any,
    opacity: any,
    radius: any
) => {
    const styles: ViewStyle = {}
    styles.shadowColor = color
    styles.shadowOffset = { width: offsetWidth, height: offsetHeight}
    styles.shadowOpacity = opacity
    styles.shadowRadius = radius
    styles.elevation = 4

    return styles
}

export const margin = (
    top: number,
    right?: number,
    bottom?: number,
    left?: number
) => dimensions(top, right, bottom, left, "margin")

export const padding = (
    top: number,
    right?: number,
    bottom?: number,
    left?: number
) => dimensions(top, right, bottom, left, "padding")

export const centerItem = (flex?: boolean) => center(flex)

export const border = (width: number, color: string, position?: string) => borderItem(width, color, position)

export const borderRadius = (
    topLeft: number,
    topRight?: number,
    bottomRight?: number,
    bottomLeft?: number) => borderRadiusItem(topLeft, topRight, bottomRight, bottomLeft)

export const shadow = (
    color: string,
    offsetWidth: number,
    offsetHeight: number,
    opacity?: number,
    radius?: number) => boxShadow(color, offsetWidth, offsetHeight, opacity, radius)
