export function fixUrl(url: string, defaultHost?: string) {
  let result = ""
  if (url.indexOf("://") < 0) {
    result += defaultHost || ""
  }
  result += url
  return result
}
