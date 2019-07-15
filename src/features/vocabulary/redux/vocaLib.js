
import {  handleActions } from 'redux-actions';
import * as vl from './action/vocaLibAction';

const defaultState ={

    vocaBooks:[{ 	
        section: "小学", 
        "books": [{ name:"五年级", count:350}] 
        }],
    //2.当前计划
    curBookName:'五年级',
    listCount:1,
    listWordCount:10
}


export const vocaLib =  handleActions({

    [vl.LOAD_VOCA_BOOKS] : (state, action) => {
        return { ...state,  vocaBooks: action.payload.vocaBooks};
    },
    [vl.CHANGE_VOCA_BOOK] : (state, action) => {
        return { ...state,  ...action.payload};
    },


}, defaultState);

