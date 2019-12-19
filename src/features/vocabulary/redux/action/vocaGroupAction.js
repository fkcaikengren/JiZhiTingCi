import { createActions } from 'redux-actions';

export const SYNC_GROUP = 'SYNC_GROUP'  
export const SYNC_GROUP_START = 'SYNC_GROUP_START'  
export const SYNC_GROUP_SUCCEED = 'SYNC_GROUP_SUCCEED'  
export const SYNC_GROUP_FAIL = 'SYNC_GROUP_FAIL'  


const fn = (payload)=>{
  return payload
}

export const {syncGroup} = createActions({
  [SYNC_GROUP]:fn
})