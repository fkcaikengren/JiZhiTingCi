
import {  handleActions } from 'redux-actions';
import * as vl from './action/vocaLibAction';

const defaultState ={

    //单词书
    books:[],
    //加载状态
    isLoadPending:false,
    //当前计划
    plan: {
        bookCode: "",
        bookName: "",
        taskCount: 0,
        taskWordCount: 0,
        //
        totalWCount : 0,
        learnedWCount : 0,
        totalDays : 0,
        learnedDays : 0,
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

