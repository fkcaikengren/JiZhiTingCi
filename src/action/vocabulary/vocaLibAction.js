import { createActions } from 'redux-actions';

export const LOAD_VOCA_BOOKS = 'LOAD_VOCA_BOOKS'    //1查看单词书
export const CHANGE_VOCA_BOOK = 'CHANGE_VOCA_BOOK'    //1切换单词书




//驼峰式命名，不可以更改(与变量名必须对应)

export const {loadVocaBooks,changeVocaBook} = createActions({
    [LOAD_VOCA_BOOKS]: async () => {
        //发送Http加载单词书
        // let response = await Http.get('/vocaBook/getVocaBooks')
        // console.log('response.data :')
        // console.log(response.data)
       


        //加载生词本数据
        const vocaBooks = await require('../../component/vocaBooks.json');


        return {vocaBooks};
    },
    [CHANGE_VOCA_BOOK]:(curBookName, listCount,listWordCount) => {
        //修改单词书
        return {curBookName, listCount,listWordCount};
    },
    
});




