import { SET_TOAST } from "./action"


const defaultState = {
    toast: null,
}
export const appReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_TOAST:
            return { ...state, toast: action.payload.toast }
        default:
            return state
    }
}