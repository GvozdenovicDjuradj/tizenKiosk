// Taken from https://github.com/Cople/WheelPicker.git
// and modified for React + Typescript

import React from "react"
import Item, { ItemProps } from "./PickerItem"

interface Props {
  children?: Item[];
  itemStyle?: React.CSSProperties;
  onValueChange?: (value: ItemProps["value"]) => void;
  selectedValue?: string | number;
  style?: React.CSSProperties;
}

export default class WebWheelPicker extends React.PureComponent<Props> {

  public static Item = Item
  public static easings = {
    bounce: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    scroll: "cubic-bezier(0.23, 1, 0.32, 1)",
    scrollBounce: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  }

  public adjustTime = 400
  public bounceTime = 600
  public height: React.CSSProperties["height"]
  public isTouching = false
  public isTransition = false
  public lastY = 0
  public maxScrollY = 0
  public momentumThresholdDistance = 10
  public momentumThresholdTime = 300
  public pointerEvents: { cancel: string, end: string, move: string, start: string }
  public rowHeight: number
  public rows = 5
  public scroller: HTMLUListElement | null = null
  public startTime = 0
  public startY = 0
  public wheel: HTMLDivElement | null = null
  public y = 0

  constructor(props: Props) {
    super(props)
    this.pointerEvents = "ontouchstart" in window
      ? {
        cancel: "touchcancel",
        end: "touchend",
        move: "touchmove",
        start: "touchstart",
      } : {
        cancel: "mouseleave",
        end: "mouseup",
        move: "mousemove",
        start: "mousedown",
      }
    if (props.style && props.style.height) {
      this.rowHeight = parseInt(`${props.style.height}`, 10) / this.rows
      this.height = typeof props.style.height === "number"
        ? `${props.style.height}px`
        : props.style.height
    } else {
      this.rowHeight = 34
      this.height = `${this.rowHeight * this.rows}px`
    }
  }

  public setWheelRef = (el: HTMLDivElement | null) => {
    if (!el) {
      return
    }
    this.wheel = el
    this.wheel.style.height = `${this.height}`
    this.wheel.addEventListener(this.pointerEvents.start, this.start)
    this.wheel.addEventListener(this.pointerEvents.move, this.move)
    this.wheel.addEventListener(this.pointerEvents.end, this.end)
    this.wheel.addEventListener(this.pointerEvents.cancel, this.end)
  }

  public setScrollerRef = (el: HTMLUListElement | null) => {
    if (!el) {
      return
    }
    this.scroller = el
    this.scroller.style.marginTop = `${this.rowHeight * Math.floor(this.rows / 2)}px`
    this.scroller.style.transform = `translateY(${this.y}px)`
    this.scroller.addEventListener("transitionend", this.transitionEnd)
  }

  public start: EventListener = (e) => {
    e.preventDefault()

    if (!this.props.children || !this.props.children.length) {
      return
    }

    if (this.isTransition) {
      this.isTransition = false
      this.y = this.getCurrentY()
      if (this.scroller) {
        this.scroller.style.transform = `translateY(${this.y}px)`
        this.scroller.style.transition = ""
      }
    }

    this.startY = this.y
    this.lastY = "touches" in e
      ? (e as TouchEvent).touches[0].pageY
      : (e as MouseEvent).pageY
    this.startTime = Date.now()
    this.isTouching = true
  }

  public move: EventListener = (e) => {
    if (!this.isTouching) {
      return false
    }
    const y = "changedTouches" in e
      ? (e as TouchEvent).changedTouches[0].pageY
      : (e as MouseEvent).pageY
    const now = Date.now()
    const deltaY = y - this.lastY
    let targetY = this.y + deltaY
    this.lastY = y
    if (targetY > 0 || targetY < this.maxScrollY) {
      targetY = this.y + deltaY / 3
    }
    this.y = Math.round(targetY)

    if (this.scroller != null && this.scroller.style.transform) {
      this.scroller.style.transform = `translateY(${this.y}px)`
    }

    if (now - this.startTime > this.momentumThresholdTime) {
      this.startTime = now
      this.startY = y
    }
    return false
  }

  public end: EventListener = (e) => {
    if (!this.isTouching) {
      return
    }
    const deltaTime = Date.now() - this.startTime
    let duration = this.adjustTime
    let easing = WebWheelPicker.easings.scroll
    const distanceY = Math.abs(this.y - this.startY)
    let y
    this.isTouching = false
    const target = e.target as HTMLElement

    if (deltaTime < this.momentumThresholdTime &&
      distanceY <= 10 &&
      target.classList.contains("wheelpicker-item")) {
      const index = target.dataset.index ? parseInt(target.dataset.index, 10) : 0
      this.scrollTo(index * -this.rowHeight, duration, easing)
      return
    }

    if (this.resetPosition(this.bounceTime)) {
      return
    }

    if (deltaTime < this.momentumThresholdTime &&
      distanceY > this.momentumThresholdDistance) {
      const momentumVals = this.momentum(deltaTime, 0.0007)
      y = momentumVals.destination
      duration = momentumVals.duration
    } else {
      y = Math.round(this.y / this.rowHeight) * this.rowHeight
    }

    if (y > 0 || y < this.maxScrollY) {
      easing = WebWheelPicker.easings.scrollBounce
    }
    this.scrollTo(y, duration, easing)
    return
  }

  public transitionEnd: EventListener = () => {
    this.isTransition = false
    if (this.scroller) {
      this.scroller.style.transition = ""
    }
    if (!this.resetPosition(this.bounceTime)) {
      this.scrollFinish()
    }
  }

  public getCurrentY() {
    if (!this.scroller) {
      return 0
    }

    const matrixValues = window
      .getComputedStyle(this.scroller)
      .getPropertyValue("transform")
      .match(/-?\d+(\.\d+)?/g)

    if (matrixValues != null && matrixValues.length != null) {
      return parseInt(matrixValues[matrixValues.length - 1], 10)
    }

    return 0
  }

  public resetPosition(duration = 0) {
    let y = this.y
    if (y > 0) {
      y = 0
    }
    if (y < this.maxScrollY) {
      y = this.maxScrollY
    }
    if (y === this.y) {
      return false
    }
    this.scrollTo(y, duration, WebWheelPicker.easings.bounce)
    return true
  }

  public scrollTo(y: number, duration: number, easing: string) {
    if (this.scroller == null) {
      return
    }

    if (this.y === y) {
      this.scrollFinish()
      return
    }

    this.y = y

    this.scroller.style.transform = `translateY(${this.y}px)`

    if (duration && duration > 0) {
      this.isTransition = true
      this.scroller.style.transition = `transform ${duration}ms ${easing}`
      return
    }

    this.scrollFinish()
    return
  }

  public scrollFinish = () => {
    const newIndex = Math.abs(this.y / this.rowHeight)
    const { children = [], onValueChange, selectedValue } = this.props
    const selectedIndex = children.findIndex((child) =>
      child.props.value === selectedValue
    )
    if (selectedIndex !== newIndex && onValueChange) {
      onValueChange(children[newIndex].props.value)
    }
  }

  public momentum(time: number, deceleration?: number) {
    const current = this.y
    const start = this.startY
    const lowerMargin = this.maxScrollY
    const wheelSize = 0
    const rowHeight = this.rowHeight

    let distance = current - start
    const speed = Math.abs(distance) / time
    let destination
    let duration

    deceleration = deceleration === undefined ? 0.0006 : deceleration
    duration = speed / deceleration
    destination = current +
      (speed * speed) /
      (2 * deceleration) *
      (distance < 0 ? -1 : 1)
    destination = Math.round(destination / rowHeight) * rowHeight
    if (destination < lowerMargin) {
      destination = lowerMargin - (wheelSize / 2.5 * (speed / 8))
      distance = Math.abs(destination - current)
      duration = distance / speed
    } else if (destination > 0) {
      destination = wheelSize / 2.5 * (speed / 8)
      distance = Math.abs(current) + destination
      duration = distance / speed
    }
    destination = Math.round(destination)

    return { destination, duration }
  }

  public render() {
    const { children = [], itemStyle, selectedValue } = this.props
    const itemClass = (v: ItemProps["value"]) => v === selectedValue
      ? "wheelpicker-item wheelpicker-item-selected"
      : "wheelpicker-item"
    const items = children.map(({ props }, i) => (
      <li
        key={i}
        data-index={i}
        className={itemClass(props.value)}
        style={{
          lineHeight: `${this.rowHeight}px`,
          height: `${this.rowHeight}px`,
          ...itemStyle
        }}
      >
        {props.label}
      </li>
    ))
    this.maxScrollY = -this.rowHeight * (items.length - 1)
    this.y = children.findIndex((child) =>
      child.props.value === selectedValue
    ) * -this.rowHeight
    if (this.scroller) {
      this.scroller.style.transform = `translateY(${this.y}px)`
    }
    return (
      <svg height={this.height} width="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.0" />
            <stop offset="20%" stopColor="white" stopOpacity="0.3" />
            <stop offset="45%" stopColor="white" stopOpacity="1.0" />
            <stop offset="55%" stopColor="white" stopOpacity="1.0" />
            <stop offset="80%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0.0" />
          </linearGradient>
          <mask id="mask">
            <rect height="100%" width="100%" fill="url(#gradient)"></rect>
          </mask>
        </defs>
        <g mask="url(#mask)">
          <foreignObject height="100%" width="100%">
            <div className="wheelpicker-main">
              <div className="wheelpicker-wheels">
                <div className="wheelpicker-wheel" ref={this.setWheelRef}>
                  <ul
                    className="wheelpicker-wheel-scroller"
                    ref={this.setScrollerRef}
                  >
                    {items}
                  </ul>
                </div>
              </div>
              <div
                className="wheelpicker-mask wheelpicker-mask-current"
                style={{ height: `${this.rowHeight}px` }}
              />
            </div>
          </foreignObject>
        </g>
      </svg>
    )
  }
}
