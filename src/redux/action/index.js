
import { createActions } from 'redux-actions';
export const SET_MSG_TOAST = 'SET_MSG_TOAST'
export const SET_LOADING_TOAST = 'SET_LOADING_TOAST'

export const { setMsgToast, setLoadingToast } = createActions({
    [SET_MSG_TOAST]: (toast) => {
        return { toast }
    },
    [SET_LOADING_TOAST]: (toast) => {
        return { toast }
    }
})