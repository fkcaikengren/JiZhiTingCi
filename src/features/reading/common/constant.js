//匹配字符块
export const SEPERATOR_REG = /([a-z]+[\-]?[a-z]*)|([^a-z\-\s]+)|(\s)/ig
//匹配单词
export const WORD_REG = /[a-z]+[\-]?[a-z]*/i

export const DETAIL_READ = 'R1'                //类型1，仔细阅读，答题
export const MULTI_SELECT_READ = 'R2'    //类型2，选词填空
export const FOUR_SELECT_READ = 'R3'      //类型3，4选一
export const EXTENSIVE_READ = 'R4'          //类型4， 泛读