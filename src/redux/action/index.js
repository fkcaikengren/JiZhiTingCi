
import { createActions } from 'redux-actions';
export const SET_TOAST = 'SET_TOAST'
export const SET_CONFIRM_MODAL = 'SET_CONFIRM_MODAL'

const fn = (payload) => {
    return payload
}

export const { setToast, setConfirmModal} = createActions({
    [SET_TOAST]: fn,
    [SET_CONFIRM_MODAL]:fn
})