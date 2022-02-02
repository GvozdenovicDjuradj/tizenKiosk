export interface ScreenFieldsState {
  [fieldName: string]: {
    valid: boolean;
    error: string[];
  },
}

export interface ValidationState {
  [screenName: string]: ScreenFieldsState
}

export interface ValidationChangeAction {
  type: string;
  payload: ValidationState;
}
