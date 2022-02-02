import {
    Dimensions
} from "react-native"

const getUnits = () => {
    const window = Dimensions.get("window")
    const vwUnit = window.width / 100
    const vhUnit = window.height / 100
    const vmin = Math.min(vwUnit, vhUnit)
    const vmax = Math.max(vwUnit, vhUnit)
    return {
        vw: vwUnit,
        vh: vhUnit,
        vmin,
        vmax,
        w: window.width,
        h: window.height
    }
}

let units = getUnits()

export const forceUpdate = (): void => {
    units = getUnits()
}

/**
 * get Viewport Width a.k.a CSS vw
 * @param size numeric part of vw unit: vw(100) => css 100vw
 */
export const vw = (size: number): number => size * units.vw

/**
 * get Viewport Height a.k.a CSS vh
 * @param size numeric part of vh unit: vh(100) => css 100vh
 */
export const vh = (size: number): number => size * units.vh

/**
 * Size or max
 * @param size desired size
 * @param max max
 */
export const maxSize = (size: number, max: number) => (size < max) ? max : size

/**
 * Size or min
 * @param size desired size
 * @param min min
 */
export const minSize = (size: number, min: number) => (size > min) ? min : size

export const scaleSize = (fontSize: number, guidelineHeight = 752) => {

  const scaledSize = fontSize * units.h / guidelineHeight
  return Math.round(scaledSize)
}

export default {
    vw,
    vh,
    forceUpdate,
    maxSize,
    minSize
}
