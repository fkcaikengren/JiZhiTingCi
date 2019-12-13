
import { createActions } from 'redux-actions';
export const SET_TOAST = 'SET_TOAST'

const fn = (payload) => {
    return payload
}

export const { setToast } = createActions({
    [SET_TOAST]: fn
})