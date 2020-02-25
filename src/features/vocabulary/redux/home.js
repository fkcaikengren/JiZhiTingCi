
import * as ha from './action/homeAction'
import * as pa from './action/planAction'
import * as vga from './action/vocaGroupAction'
import _util from "../../../common/util";
import * as Constant from "../common/constant";
import { LOGOUT, CHANGE_CONFIG_REVIEW_PLAY_TIMES } from '../../mine/redux/action/mineAction'


const defaultState = {
    //任务数组
    tasks: [],


    //上传同步的状态
    isUploading: false,
    //上传同步失败
    isUploadFail: false,

    isTaskUploadFail: false,
    isGroupUploadFail: false,
    isCountUploadFail: false,
    isDayUploadFail: false


}

export const home = (state = defaultState, action) => {
    switch (action.type) {
        //加载任务
        case ha.LOAD_TASKS_START:
            return { ...state }
        case ha.LOAD_TASKS_SUCCEED:
            return {
                ...state, tasks: action.payload.tasks,
            };
        //更新任务
        case ha.UPDATE_TASK:
            const task = action.payload.task
            const tasks = state.tasks.map((item, i) => {
                if (item.taskOrder === task.taskOrder && item.status === task.status) { //要更新的
                    return task
                } else {
                    return item
                }
            })
            return { ...state, tasks }
        //上传单词任务
        case ha.SYNC_TASK_START:
            return { ...state, isUploading: true, isUploadFail: false, isTaskUploadFail: false }
        case ha.SYNC_TASK_SUCCEED: {
            console.log('--------同步任务成功的 tasks:------------------')
            let isUploadFail = false
            const {
                isGroupUploadFail,
                isCountUploadFail,
                isDayUploadFail
            } = state
            if (isGroupUploadFail || isCountUploadFail || isDayUploadFail) {
                isUploadFail = true
            }
            return { ...state, isUploading: false, isUploadFail, isTaskUploadFail: false }
        }
        case ha.SYNC_TASK_FAIL:
            console.log('--------同步任务失败的 tasks: -------------')
            return { ...state, isUploading: false, isUploadFail: true, isTaskUploadFail: true }
        // 更新分数
        case ha.UPDATE_SCORE: {
            const { id, taskOrder, score } = action.payload.userArticle
            const newTasks = state.tasks.map((task, i) => {
                if (task.taskType === Constant.TASK_ARTICLE_TYPE
                    && task.taskOrder === taskOrder
                    && task.id === id) {
                    task.score = score
                }
                if (task.taskType === Constant.TASK_VOCA_TYPE && task.taskOrder === taskOrder) {
                    task.taskArticles = task.taskArticles.map((ta, _) => {
                        if (ta.id === id) {
                            ta.score = score
                        }
                        return ta
                    })

                }
                return task
            })
            return { ...state, tasks: newTasks }
        }
        // 上传生词本数据
        case vga.SYNC_GROUP_START:
            console.log('------开始同步生词本-------')
            return { ...state, isUploading: true, isUploadFail: false, isGroupUploadFail: false }
        case vga.SYNC_GROUP_SUCCEED: {
            console.log('--------同步生词本成功: -------------')
            let isUploadFail = false
            const {
                isTaskUploadFail,
                isCountUploadFail,
                isDayUploadFail
            } = state
            if (isTaskUploadFail || isCountUploadFail || isDayUploadFail) {
                isUploadFail = true
            }
            return { ...state, isUploading: false, isUploadFail, isGroupUploadFail: false }
        }
        case vga.SYNC_GROUP_FAIL:
            console.log('--------同步生词本失败: -------------')
            return { ...state, isUploading: false, isUploadFail: true, isGroupUploadFail: true }
        //同步统计数据 
        case pa.SYN_ALL_LEARNED_DAYS_START:
            return { ...state, isUploading: true, isUploadFail: false, isCountUploadFail: false }
        case pa.SYN_ALL_LEARNED_DAYS_SUCCEED: {
            let isUploadFail = false
            const {
                isTaskUploadFail,
                isGroupUploadFail,
                isDayUploadFail
            } = state
            if (isTaskUploadFail || isGroupUploadFail || isDayUploadFail) {
                isUploadFail = true
            }
            return { ...state, isUploading: false, isUploadFail, isCountUploadFail: false }
        }
        case pa.SYN_ALL_LEARNED_DAYS_FAIL:
            return { ...state, isUploading: false, isUploadFail: true, isCountUploadFail: true }

        case pa.SYN_FINISH_DAYS_START:
            return { ...state, isUploading: true, isUploadFail: false, isDayUploadFail: false }
        case pa.SYN_FINISH_DAYS_SUCCEED: {
            let isUploadFail = false
            const {
                isTaskUploadFail,
                isGroupUploadFail,
                isCountUploadFail
            } = state
            if (isTaskUploadFail || isGroupUploadFail || isCountUploadFail) {
                isUploadFail = true
            }
            return { ...state, isUploading: false, isUploadFail, isDayUploadFail: false }
        }
        case pa.SYN_FINISH_DAYS_FAIL:
            return { ...state, isUploading: false, isUploadFail: true, isDayUploadFail: true }

        // 修改配置的复习轮播遍数
        case CHANGE_CONFIG_REVIEW_PLAY_TIMES: {
            const newTasks2 = state.tasks.map((task, index) => {
                if (task.taskType === Constant.TASK_VOCA_TYPE) {
                    if (task.status !== Constant.STATUS_0 && task.progress === Constant.IN_REVIEW_PLAY) {
                        //复习轮播任务
                        let leftTimes = task.leftTimes >= action.payload.configReviewPlayTimes ?
                            action.payload.configReviewPlayTimes : task.leftTimes
                        return {
                            ...task,
                            curIndex: 0,
                            leftTimes,
                        }

                    } else {
                        //新学任务 or 复习非轮播任务
                        return task
                    }
                } else {
                    return task
                }
            })
            return { ...state, tasks: newTasks2 }
        }


        // 退出登录
        case LOGOUT:
            return defaultState
        default:
            return state
    }
}
