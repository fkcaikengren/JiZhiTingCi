
// 词汇书类型
export const TYPE_VOCA_BOOK_WORD = 11       //单词词汇书，
export const TYPE_VOCA_BOOK_READ = 12       //阅读词汇书，
export const TYPE_VOCA_BOOK_PHRASE = 13     //短语词汇书，
export const TYPE_VOCA_BOOK_DIY = 14     // 自定义词汇书


export const LEFT_PLUS_DAYS = 13

export const NORMAL_PLAY = 'NORMAL_PLAY'         //普通模式的轮播
export const LEARN_PLAY = 'LEARN_PLAY'          //学习模式的轮播
export const REVIEW_PLAY = 'REVIEW_PLAY'        //复习模式的轮播

export const LEARN_PLAY_TIMES = 3        //学习模式默认播放3遍
export const REVIEW_PLAY_TIMES = 6      //复习模式默认播放10遍


export const DELAY_DAYS_0 = 0       //待学可推迟天数
export const DELAY_DAYS_1 = 1       //1复可推迟时间
export const DELAY_DAYS_2 = 2       //2复可推迟时间
export const DELAY_DAYS_4 = 3       //4复可推迟时间
export const DELAY_DAYS_7 = 4       //7复可推迟时间
export const DELAY_DAYS_15 = 5      //15复可推迟时间


// 任务状态
export const STATUS_0 = 0
export const STATUS_1 = 1
export const STATUS_2 = 2
export const STATUS_4 = 4
export const STATUS_7 = 7
export const STATUS_15 = 15
export const STATUS_200 = 200

//学习进度
export const IN_LEARN_PLAY = 'IN_LEARN_PLAY'
export const IN_LEARN_CARD = 'IN_LEARN_CARD'
export const IN_LEARN_TEST_1 = 'IN_LEARN_TEST_1'
export const IN_LEARN_RETEST_1 = 'IN_LEARN_RETEST_1'
export const IN_LEARN_TEST_2 = 'IN_LEARN_TEST_2'
export const IN_LEARN_RETEST_2 = 'IN_LEARN_RETEST_2'
export const IN_LEARN_FINISH = 'IN_LEARN_FINISH'

//复习进度
export const IN_REVIEW_PLAY = 'IN_REVIEW_PLAY'
export const IN_REVIEW_TEST = 'IN_REVIEW_TEST'
export const IN_REVIEW_RETEST = 'IN_REVIEW_RETEST'
export const IN_REVIEW_FINISH = 'IN_REVIEW_FINISH'



// normalType 的两种取值
export const BY_REAL_TASK = 'BY_REAL_TASK'
export const BY_VIRTUAL_TASK = 'BY_VIRTUAL_TASK'
export const VIRTUAL_TASK_ORDER = 1000000

//howPlay 播放方式
export const PLAY_WAY_SINGLE = 'PLAY_WAY_SINGLE' //单曲循环
export const PLAY_WAY_LOOP = 'PLAY_WAY_LOOP'  //顺序播放


//最小播放数量
export const MIN_PLAY_NUMBER = 5

//task 的两种类型
export const TASK_VOCA_TYPE = 'TASK_VOCA_TYPE'
export const TASK_ARTICLE_TYPE = 'TASK_ARTICLE_TYPE'


//单词列表
export const WRONG_LIST = 'WRONG_LIST'
export const PASS_LIST = 'PASS_LIST'
export const LEARNED_LIST = 'LEARNED_LIST'
export const NEW_LIST = 'NEW_LIST'

//测试种类
export const WORD_TRAN = 'WORD_TRAN'
export const PRON_TRAN = 'PRON_TRAN'
export const TRAN_WORD = 'TRAN_WORD'
export const SEN_WORD = 'SEN_WORD'



//单词发音类型
export const VOCA_PRON_TYPE_EN = 'VOCA_PRON_TYPE_EN'
export const VOCA_PRON_TYPE_AM = 'VOCA_PRON_TYPE_AM'


//手动报错：错误类型
export const TYPE_ERR_CODE_VOCA = 0
export const TYPE_ERR_CODE_ARTICLE = 1