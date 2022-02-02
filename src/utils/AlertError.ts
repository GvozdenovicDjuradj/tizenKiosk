export default class AlertError extends Error {

  public title: string

  constructor(title: string, message?: string) {
    super(`${title} ${message}`)
    this.title = title
    this.message = message || ""
    this.name = "AlertError"
    // tslint:disable-next-line:max-line-length
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, AlertError.prototype)
  }

  public toString() {
    return `${this.title}: ${this.message}`
  }
}
