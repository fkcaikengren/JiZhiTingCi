import { SET_TOAST, SET_LOADER, SET_CONFIRM_MODAL, SET_COMMON_MODAL } from "./action"


const defaultState = {
    toast: null,
    loader: null,
    confirmModal: null,
    commonModal: null,
}
export const appReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_TOAST:
            return { ...state, toast: action.payload.toast }
        case SET_LOADER:
            return { ...state, loader: action.payload.loader }
        case SET_CONFIRM_MODAL:
            return { ...state, confirmModal: action.payload.confirmModal }
        case SET_COMMON_MODAL:
            return { ...state, commonModal: action.payload.commonModal }
        default:
            return state
    }
}