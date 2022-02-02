import { runSaga, RunSagaOptions } from "redux-saga"
import { Action } from "redux"
import { AppScreens, RootState } from "../../src/interfaces"
import { createAppState, createState } from "../fixtures"
import { hideScreenSaver, loadScreenSaverData, watchSettingsChange } from "../../src/sagas/app"
import * as navigation from "../../src/navigation"
import { APP } from "../../src/actions/types"
import callApi from "../../src/sagas/api"

jest.mock("../../src/navigation", () => ({
    getCurrentRoute: jest.fn()
}))

jest.mock("../../src/sagas/api")

const withCurrentScreenAs = (appScreen: AppScreens): void => {
    (navigation.getCurrentRoute as jest.Mock).mockImplementation(() => ({
        routeName: appScreen
    }))
}

const withInitialScreenAs = (appScreen: AppScreens): RootState =>
    createState({
        app: createAppState({
            initialScreen: appScreen
        })
    })

const withInitialAndCurrentScreenAs = (initialScreen: AppScreens, appScreen: AppScreens = initialScreen): RootState => {
    withCurrentScreenAs(appScreen)
    return withInitialScreenAs(initialScreen)
}

const withKioskSettingsResponseAndInitialAndCurrentScreenOnTheHomeScreen = (): RootState => {
    (callApi as jest.Mock).mockImplementation(() => ({
        data: {
            template: {
                enableScreensaver: true
            }
        }
    }))

    return withInitialAndCurrentScreenAs(AppScreens.HOME)
}

describe(`the app sagas module`, () => {
    let dispatched: Action[] = []
    let state: RootState = createState()

    const storeInterface: RunSagaOptions<Action, RootState> = {
        dispatch: (action) => dispatched.push(action),
        getState: () => state
    }

    describe(`the hideScreenSaver saga`, () => {
        beforeEach(() => {
            dispatched = []
        })

        it(`should not dispatch any action when the application is not on the screen saver screen`, async () => {
            // Given
            withCurrentScreenAs(AppScreens.CHECK_IN_CONFIRMATION)

            // When
            await (runSaga(storeInterface, hideScreenSaver) as any)

            // Then
            expect(dispatched).toHaveLength(0)
        })

        it(`should dispatch the APP_GO_INITIAL_SCREEN_REQUEST action when the application is on the
            screen saver screen`, async () => {
            // Given
            withCurrentScreenAs(AppScreens.SCREEN_SAVER)

            // When
            await (runSaga(storeInterface, hideScreenSaver) as any)

            // Then
            expect(dispatched).toHaveLength(1)
            expect(dispatched[0].type).toBe(APP.GO_INITIAL_SCREEN.REQUEST)
        })
    })

    describe(`the watchSettingsChange saga`, () => {
        beforeEach(() => {
            dispatched = []
        })

        it(`should not dispatch any action when the application is on the screen saver screen`, async () => {
            // Given
            state = withInitialAndCurrentScreenAs(AppScreens.SCREEN_SAVER)

            // When
            await (runSaga(storeInterface, watchSettingsChange) as any)

            // Then
            expect(dispatched).toHaveLength(0)
        })

        it(`should dispatch the APP_GO_INITIAL_SCREEN_REQUEST action when the application is
            on the home screen`, async () => {
            // Given
            state = withInitialAndCurrentScreenAs(AppScreens.HOME)

            // When
            await (runSaga(storeInterface, watchSettingsChange) as any)

            // Then
            expect(dispatched).toHaveLength(1)
            expect(dispatched[0]).toHaveProperty("type", APP.GO_INITIAL_SCREEN.REQUEST)
        })

        it(`should dispatch both CHANGE_INITIAL_PAGE_REQUEST and APP_GO_INITIAL_SCREEN_REQUEST
            actions when the application is on the chick in confirmation screen`, async () => {
            // Given
            state = withInitialAndCurrentScreenAs(AppScreens.CHECK_IN_CONFIRMATION)

            // When
            await (runSaga(storeInterface, watchSettingsChange) as any)

            // Then
            expect(dispatched).toHaveLength(2)
            expect(dispatched[0]).toHaveProperty("type", "CHANGE_INITIAL_PAGE_REQUEST")
            expect(dispatched[0]).toHaveProperty("payload", "HOME")
            expect(dispatched[1]).toHaveProperty("type", "APP_GO_INITIAL_SCREEN_REQUEST")
        })
    })

    describe(`the loadScreenSaverData saga`, () => {
        beforeEach(() => {
            dispatched = []
        })

        it(`should not dispatch any action when the application is on the screen saver screen`, async () => {
            // Given
            state = withInitialAndCurrentScreenAs(AppScreens.HOME, AppScreens.SCREEN_SAVER)

            // When
            await (runSaga(storeInterface, loadScreenSaverData) as any)

            // Then
            expect(dispatched).toHaveLength(0)
        })

        it(`should dispatch KIOSK_SETTINGS_SUCCESS when the application is on the initial screen`, async () => {
            // Given
            state = withKioskSettingsResponseAndInitialAndCurrentScreenOnTheHomeScreen()

            // When
            await (runSaga(storeInterface, loadScreenSaverData) as any)

            // Then
            expect(dispatched).toHaveLength(1)
            expect(dispatched[0]).toHaveProperty("type", "KIOSK_SETTINGS_SUCCESS")
            expect(dispatched[0]).toHaveProperty("payload.template.enableScreensaver", true)
        })
    })
})
