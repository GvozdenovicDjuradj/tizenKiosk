import * as navigation from "../navigation"
import { AppScreens } from "../interfaces"

export const isScreenSaverActive = () => {
  const route = navigation.getCurrentRoute()
  return route && route.routeName === AppScreens.SCREEN_SAVER
}

export const configureIOSPlayer = (containerStyle: string, videoStyle: string, url?: string) => `
  <html>
    <body style="padding: 0; margin: 0;">
      <div id="wrapper" style=${containerStyle}>
        <video style="transform: translate(-50%, 0); ${videoStyle}" autoplay playsinline muted loop>
          <source src=${url} type="video/mp4">
        </video>
      </div>

      <script>
        document.getElementById("wrapper").onclick = function() {
          window.postMessage()
        }
      </script>
    </body>
  </html>
`
