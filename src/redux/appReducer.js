import { SET_LOADING_TOAST, SET_MSG_TOAST } from "./action"


const defaultState = {
    msgToast: null,
    loadingToast: null
}
export const appReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_MSG_TOAST:
            return { ...state, msgToast: action.payload.toast }
        case SET_LOADING_TOAST:
            return { ...state, loadingToast: action.payload.toast }
        default:
            return state
    }
}