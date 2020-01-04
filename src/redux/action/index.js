
import { createActions } from 'redux-actions';
export const SET_TOAST = 'SET_TOAST'
export const SET_CONFIRM_MODAL = 'SET_CONFIRM_MODAL'
export const SET_COMMON_MODAL = 'SET_COMMON_MODAL'

const fn = (payload) => {
    return payload
}

export const { setToast, setConfirmModal, setCommonModal } = createActions({
    [SET_TOAST]: fn,
    [SET_CONFIRM_MODAL]: fn,
    [SET_COMMON_MODAL]: fn
})