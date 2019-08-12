import { createActions } from 'redux-actions';

//切换编辑状态
export const TOGGLE_EDIT = 'TOGGLE_EDIT'




//驼峰式命名，不可以更改(与变量名必须对应)
export const {toggleEdit} = createActions({
    //切换编辑状态
    [TOGGLE_EDIT]: ()=>{
        return {}
    },

    
});
