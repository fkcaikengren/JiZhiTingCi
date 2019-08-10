//匹配字符块
export const SEPERATOR_REG = /([a-z]+[\-]?[a-z]*)|([^a-z\-\s]+)|(\s)/ig
//匹配单词
export const WORD_REG = /[a-z]+[\-]?[a-z]*/i

export const DETAIL_READ = 'DETAIL_READ'                //类型1，仔细阅读，答题
export const MULTI_SELECT_READ = 'MULTI_SELECT_READ'    //类型2，选词填空
export const FOUR_SELECT_READ = 'FOUR_SELECT_READ'      //类型3，4选一
export const EXTENSIVE_READ = 'EXTENSIVE_READ'          //类型4， 泛读