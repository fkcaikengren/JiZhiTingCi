import { SET_TOAST,SET_CONFIRM_MODAL } from "./action"


const defaultState = {
    toast: null,
    confirmModal: null,
}
export const appReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_TOAST:
            return { ...state, toast: action.payload.toast }
        case SET_CONFIRM_MODAL:
            return { ...state, confirmModal: action.payload.confirmModal }
        default:
            return state
    }
}