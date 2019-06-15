

import { createActions } from 'redux-actions';
import VocaGroupDao from '../../dao/vocabulary/VocaGroupDao'


export const LOAD_VOCA_GROUPS = 'LOAD_VOCA_GROUPS'//1.1 查看所有生词本
export const ADD_VOCA_GROUP = 'ADD_VOCA_GROUP'//1.2 添加新生词本
export const UPDATE_GROUP_NAME = 'UPDATE_GROUP_NAME'//3 修改名称
export const DELETE_GROUP = 'DELETE_GROUP'//4 删除
//关闭数据库
export const CLOSE_VOCA_GROUP_REALM = 'CLOSE_VOCA_GROUP_REALM'


//驼峰式命名，不可以更改(与变量名必须对应)

export const {loadVocaGroups,addVocaGroup,updateGroupName, deleteGroup ,getWords, closeVocaGroupRealm} = createActions({
    [LOAD_VOCA_GROUPS]: (vocaGroups) => {
        return {vocaGroups}
    },
   
});


