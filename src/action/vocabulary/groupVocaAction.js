

import { createActions } from 'redux-actions';


export const LOAD_SECTIONS_WORDS = 'LOAD_SECTIONS_WORDS' //1 加载生词本的分类和生词


//驼峰式命名，不可以更改(与变量名必须对应)

export const {loadSectionsWords} = createActions({
   
    
    [LOAD_SECTIONS_WORDS]: (groupName, sectionsWords) =>{
        return {groupName , sectionsWords}

    }
   
});


