import {  handleActions } from 'redux-actions';
import * as vg from '../../action/vocabulary/vocaGroupAction';

const defaultState ={

    //生词本数据
    vocaGroups:[{
        groupName:"0自定义生词本",	
        count:2,
		words:[{
			id:0,	
            id:"abandon",
            passed:false,
            wrongNum:3
		},{
			id:1,	
            id:"abc",
            passed:false,
            wrongNum:2
		}]	
	}],
 
}


export const vocaGroup =  handleActions({

    [vg.LOAD_VOCA_GROUPS] : (state, action) => {
        return { ...state,  vocaGroups: action.payload.vocaGroups};
    },
    [vg.ADD_VOCA_GROUP] : (state, action) => {          //添加生词本
        let vocaGroups = state.vocaGroups.slice();
        vocaGroups.push(action.payload.vocaGroup);
        console.log(vocaGroups);
        return {...state, vocaGroups}
    },

    [vg.UPDATE_GROUP_NAME] :  (state, action) => {      //修改名称
        let vocaGroups = state.vocaGroups.map((g, i)=>{
            if(action.payload.oldName === g.groupName){
                //创建一个新的vocaGroup
                console.log(action.payload.newName);
                return {...g, groupName:action.payload.newName}
            }else{
                return g
            }
        })
        return {...state, vocaGroups};
    },
    [vg.DELETE_GROUP]: (state, action) => {             //删除生词本
        let vocaGroups  = state.vocaGroups.filter(({groupName}) => {
            if(action.payload.groupName === groupName){
                return false
            }else{
                return true
            }
        });
        
        return ({...state, vocaGroups});
    },
}, defaultState);