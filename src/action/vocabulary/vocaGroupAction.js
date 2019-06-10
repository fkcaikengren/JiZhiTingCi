

import { createActions } from 'redux-actions';

export const LOAD_VOCA_GROUPS = 'LOAD_VOCA_GROUPS'//1.1 查看所有生词本
export const ADD_VOCA_GROUP = 'ADD_VOCA_GROUP'//1.2 添加新生词本
export const UPDATE_GROUP_NAME = 'UPDATE_GROUP_NAME'//3 修改名称
export const DELETE_GROUP = 'DELETE_GROUP'//4 删除



//驼峰式命名，不可以更改(与变量名必须对应)

export const {loadVocaGroups,addVocaGroup,updateGroupName, deleteGroup ,getWords} = createActions({
    [LOAD_VOCA_GROUPS]: async () => {
        //加载生词本数据
        const vocaGroups = await require('../../component/vocaGroups.json');
        return {vocaGroups};
    },
    [ADD_VOCA_GROUP]: (name) =>{
        const vocaGroup = {
            groupName:name,	
            count: 0,
            words:[] 
        }
        return {vocaGroup};
    },
    [UPDATE_GROUP_NAME]: (oldName,newName) =>{
        return {oldName,newName};
    },
    [DELETE_GROUP]: (groupName) =>{
        return {groupName};
    },

   
});


