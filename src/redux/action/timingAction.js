import { createActions } from 'redux-actions';

export const CHANGE_WHOLE_SECONDS = 'CHANGE_WHOLE_SECONDS'
export const DECREASE_SECOND = 'DECREASE_SECOND'



const fn = (payload) => {
    return payload
}

export const { changeWholeSeconds, decreaseSecond } = createActions({
    [CHANGE_WHOLE_SECONDS]: fn,
    [DECREASE_SECOND]: fn
})