import { AppScreens } from "./routes"

export interface AppState {
  initialScreen: AppScreens;
  keyboardDisplayed: boolean;
  offline: boolean;
  deviceImei: string | null;
}
