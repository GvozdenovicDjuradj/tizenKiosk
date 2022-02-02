import { applyMiddleware, compose, createStore, Middleware } from "redux"
import { createLogger } from "redux-logger"
import { persistStore } from "redux-persist"
import createSagaMiddleware from "redux-saga"
import rootReducer from "../reducers"
import rootSaga from "../sagas"

const middlewares: Middleware[] = []

const sagaMiddleware = createSagaMiddleware()
middlewares.push(sagaMiddleware)

if (__DEV__) {
  middlewares.push(createLogger())
}

const composeEnhancers = (
  typeof window === "object" && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) :
    compose
)

const enhancer = composeEnhancers(
  applyMiddleware(
    ...middlewares
  )
)

export const store = createStore(rootReducer, enhancer)

export const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)
