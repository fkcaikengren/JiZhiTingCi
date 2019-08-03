//匹配字符块
export const SEPERATOR_REG = /([a-z]+[\-]?[a-z]*)|([^a-z\-\s]+)|(\s)/ig
//匹配单词
export const WORD_REG = /[a-z]+[\-]?[a-z]*/i

//每次渲染组件量
export const RENDER_COUNT = 400