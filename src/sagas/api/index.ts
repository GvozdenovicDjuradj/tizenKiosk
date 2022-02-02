import axios, { AxiosPromise, AxiosRequestConfig } from "axios"
import { Platform } from "react-native"
import AppVersion from "../../appVersion"

export enum HTTPMethod {
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PUT = "PUT",
}

interface AxiosPromiseCancellable extends AxiosPromise {
  cancel: () => void;
}

const defaultParams: AxiosRequestConfig = {
  cancelToken: undefined,
  method: HTTPMethod.GET,
}

export default function callApi(url: string, params: AxiosRequestConfig = defaultParams) {
  const source = axios.CancelToken.source()
  const { headers, ...restParams } = params
  restParams.cancelToken = source.token
  const customHeaders = Platform.select({
    web: headers,
    default: {
      ...headers,
      "Connection": "close",
      "User-Agent": `RNQudiniKiosk/${AppVersion}`
    }
  })
  const axiosPromise = axios({
    url,
    ...restParams,
    headers: customHeaders
  })
  return Object.defineProperty(
    axiosPromise,
    "cancel", {
      enumerable: true,
      value: source.cancel,
    },
  ) as AxiosPromiseCancellable
}
