

import { createActions } from 'redux-actions';


export const LOAD_GROUP_VOCAS = 'LOAD_GROUP_VOCAS' //1 加载生词本的生词


//驼峰式命名，不可以更改(与变量名必须对应)

export const {loadGroupVocas} = createActions({
   
    
    [LOAD_GROUP_VOCAS]: async (groupName) =>{
        let groupVocas = [];
        //判断是什么类型的生词本
        if(groupName.startsWith('0')){      //自定义
            //加载words
            groupVocas = await require('../../component/words.json');

        }else if(groupName.startsWith('1')){    //阅读生词本
            console.log(groupName);
            //加载chapters
            groupVocas = await require('../../component/chapters.json')
        }
        return {groupName, groupVocas}

    }
   
});


