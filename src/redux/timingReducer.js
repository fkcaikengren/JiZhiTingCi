import { CHANGE_WHOLE_SECONDS, DECREASE_SECOND } from "./action/timingAction"
import { LOGOUT } from "../features/mine/redux/action/mineAction"

const defaultState = {
    timeIndex: 0,
    wholeSeconds: 0
}

export const timingReducer = (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_WHOLE_SECONDS:
            return {
                ...state,
                timeIndex: action.payload.timeIndex,
                wholeSeconds: action.payload.wholeSeconds
            }
        case DECREASE_SECOND:
            return { ...state, wholeSeconds: state.wholeSeconds - 1 }
        case LOGOUT:
            return defaultState
        default:
            return state
    }
}