
import {  handleActions } from 'redux-actions';
import * as vl from './action/vocaLibAction';

const defaultState ={

    //单词书
    books:[],
    //状态
    isLoadPending:false,
    //当前计划
    plan: {
        bookCode: "VB_1",
        bookName: "四级词汇书",
        taskCount: 1,
        taskWordCount: 15
    },
}


export const vocaLib =  handleActions({

    [vl.LOAD_VOCA_BOOKS_START] : (state, action) => {
        return { ...state,  isLoadPending:true};
    },
    [vl.LOAD_VOCA_BOOKS_SUCCEED] : (state, action) => {
        return { ...state, books:action.books, isLoadPending:false};
    },

    [vl.CHANGE_VOCA_BOOK_START] : (state, action) => {
        return { ...state,  isLoadPending:true};
    },
    [vl.CHANGE_VOCA_BOOK_SUCCEED] : (state, action) => {
        return { ...state, plan:action.plan, isLoadPending:false};
    },

}, defaultState);

