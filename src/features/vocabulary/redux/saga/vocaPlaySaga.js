import { takeLatest, put } from "redux-saga/effects"

import { store } from "../../../../redux/store"
import { LOAD_TASK, CHANGE_PLAY_LIST_INDEX, CHANGE_PLAY_LIST_INDEX_START, CHANGE_PLAY_LIST_INDEX_SUCCEED } from "../action/vocaPlayAction"
import { BY_REAL_TASK, BY_VIRTUAL_TASK } from "../../common/constant"
import VocaTaskDao from "../../service/VocaTaskDao"
import VocaDao from "../../service/VocaDao"
import VocaGroupService from "../../service/VocaGroupService"
import VocaUtil from "../../common/vocaUtil"



/**
 * @description  切换播放列表下标
 */
export function* changePlayListIndex(action) {
    const { changeType } = action.payload
    const { playListIndex, playTaskList, playGroupList, normalType } = store.getState().vocaPlay
    yield put({ type: CHANGE_PLAY_LIST_INDEX_START })
    let index = playListIndex
    if (changeType === -1) { //播放上一个
        if (normalType === BY_REAL_TASK) {
            if (playListIndex >= 0) {
                index = (playListIndex - 1 + playTaskList.length) % playTaskList.length
            }
        } else if (normalType === BY_VIRTUAL_TASK) {
            if (playListIndex >= 0) {
                index = (playListIndex - 1 + playGroupList.length) % playGroupList.length
            }
        }

    } else if (changeType === 1) { //播放下一个
        if (normalType === BY_REAL_TASK) {
            if (playListIndex >= 0) {
                index = (playListIndex + 1) % playTaskList.length
            }
        } else if (normalType === BY_VIRTUAL_TASK) {
            if (playListIndex >= 0) {
                index = (playListIndex + 1) % playGroupList.length
            }
        }

    } else if (changeType === 0) { //播放指定的
        console.log('changeType===0')
        console.log(action.payload.playListIndex)
        index = action.payload.playListIndex
    }

    if (index >= 0) {
        let showWordInfos = []
        let nextTask = {}
        if (normalType === BY_REAL_TASK) {
            //加载任务播放
            nextTask = VocaTaskDao.getInstance().getTaskByOrder(playTaskList[index])
            nextTask.playName = VocaUtil.genTaskName(nextTask.taskOrder)
            showWordInfos = VocaDao.getInstance().getShowWordInfos(nextTask.taskWords)
        } else if (normalType === BY_VIRTUAL_TASK) {
            //加载生词播放
            console.log('--saga 加载生词播放--')
            console.log(index)
            const group = new VocaGroupService().getGroupAndWordsById(playGroupList[index])
            nextTask = VocaUtil.genVirtualTask(group.words, group.groupName, group.id)
            nextTask.listenTimes = group.listenTimes
            nextTask.testTimes = group.testTimes
            showWordInfos = VocaDao.getInstance().getWordInfos(group.words)
        }
        yield put({
            type: CHANGE_PLAY_LIST_INDEX_SUCCEED,
            payload: { playListIndex: index }
        })
        yield put({
            type: LOAD_TASK, payload: {
                task: nextTask,
                showWordInfos: showWordInfos
            }
        })

    }
}

export function* watchChangePlayListIndex() {
    yield takeLatest(CHANGE_PLAY_LIST_INDEX, changePlayListIndex)
}
