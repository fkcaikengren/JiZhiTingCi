
import * as ha from './action/homeAction'
import _util from "../../../common/util";
import * as Constant from "../common/constant";
import VocaTaskDao from "../service/VocaTaskDao";

const defaultState = {
    //任务数组
    tasks: [],
    //上一次学习
    lastLearnDate: null,
    //状态
    isLoadPending: false,

    //上传同步的状态
    isUploading: false,
    //上传同步失败
    isUploadFail: false,


}

export const home = (state = defaultState, action) => {
    switch (action.type) {
        //加载任务
        case ha.LOAD_TASKS_START:
            return { ...state, isLoadPending: true }
        case ha.LOAD_TASKS_SUCCEED:
            console.log('----------加载完后设置lastLearnDate :------')
            console.log(_util.getDayTime(0))
            return {
                ...state, tasks: action.payload.tasks,
                isLoadPending: false,
                isUploadFail: false,
                lastLearnDate: _util.getDayTime(0)
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

            console.log('----redudx: after update tasks-----------')
            // console.log(tasks)
            // //保存至本地
            return { ...state, tasks }
        //上传同步任务
        case ha.SYNC_TASK:
            return { ...state, isUploading: true }
        case ha.SYNC_TASK_SUCCEED:
            console.log('--------保存后，上传后的tasks:------------------')
            // console.log(state.tasks)
            return { ...state, isUploading: false, isUploadFail: false }
        case ha.SYNC_TASK_FAIL:
            console.log('--------上传失败后的 tasks: -------------')
            // console.log(state.tasks)
            return { ...state, isUploading: false, isUploadFail: true }
        case ha.UPDATE_SCORE:
            const { id, taskOrder, score } = action.payload.userArticle
            VocaTaskDao.getInstance().modifyArticle(action.payload.userArticle)
            const newTasks = state.tasks.map((task, i) => {
                if (task.taskType === Constant.TASK_ARTICLE_TYPE && task.id === id) {
                    task.score = score
                } else if (task.taskType === Constant.TASK_VOCA_TYPE && task.taskOrder === taskOrder) {
                    const articles = JSON.parse(task.articles)
                    for (let art of articles) {
                        if (art.id === id) {  //同一篇文章
                            art.score = score
                        }
                    }
                    task.articles = JSON.stringify(articles)
                }
                return task
            })
            return { ...state, tasks: newTasks }
        default:
            return state
    }
}
