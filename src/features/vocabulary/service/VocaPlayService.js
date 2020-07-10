
import RNExitApp from 'react-native-exit-app';
import BackgroundTimer from 'react-native-background-timer'
import AudioService from '../../../common/AudioService'
import { store } from '../../../redux/store'
import NotificationManage from '../../../modules/NotificationManage'
import * as CConstant from '../../../common/constant'

export default class VocaPlayService {

    constructor({ listRef, stateRef, changeCurIndexAndAutoTimer, changePlayTimer, finishQuit = null, }) {

        this.listRef = listRef
        this.stateRef = stateRef
        this.changeCurIndexAndAutoTimer = changeCurIndexAndAutoTimer
        this.changePlayTimer = changePlayTimer
        this.finishQuit = finishQuit

        this.audioService = AudioService.getInstance()


        //监听关闭通知控制条
        NotificationManage.onClose((evt) => {
            RNExitApp.exitApp();
        })

        //监听通知控制条的暂停
        NotificationManage.onPause((evt) => {
            console.log('--窗口发送暂停--')
            let source = store.getState().vocaPlay
            if (this.stateRef) {
                source = this.stateRef
            }
            const { autoPlayTimer } = source
            this.changePlayTimer(0)
            BackgroundTimer.clearTimeout(autoPlayTimer);
        })

        //监听通知控制条的播放
        NotificationManage.onPlay((evt) => {
            // console.log('--窗口发送播放--')
            let source = store.getState().vocaPlay
            if (this.stateRef) {
                source = this.stateRef
            }
            const { curIndex } = source
            this.autoplay(curIndex)
        })

        console.log("stateRef")
        // console.log(stateRef)
    }
    //单例模式
    static getInstance() {
        if (!this.instance) {
            this.instance = new VocaPlayService({
                listRef: null, stateRef: null,
                changeCurIndexAndAutoTimer: null, changePlayTimer: null, finishQuit: null,
            });
        }
        return this.instance;
    }


    setStateRef = (state) => {
        // console.log(state)
        this.stateRef = { ...this.stateRef, ...state }

    }



    /**
     * @description 自动播放 
     */
    autoplay = (index) => {
        console.log('---autoplay--->index: ' + index)
        let source = store.getState().vocaPlay
        if (this.stateRef) {
            source = this.stateRef
        }

        const { task, showWordInfos, interval } = source
        const { wordCount } = task


        // 1.滑动 {animated: boolean是否动画, index: item的索引, viewPosition:视图位置（0-1） };
        let params = { animated: true, index, viewPosition: 0.5 };
        if (wordCount > 0) {
            if (this.listRef && index < wordCount) {
                // console.log('move');
                this.listRef.scrollToIndex(params);
            }
            //2.更新通知栏的单词
            if (this.stateRef === null) {
                const word = showWordInfos[index] ? showWordInfos[index].word : '~'
                NotificationManage.updateWord(word, (e) => { console.log(e) },
                    () => { })
            }

            //3.播放单词音频
            this.audioService.playSound({
                pDir: CConstant.VOCABULARY_DIR,
                fPath: showWordInfos[index] ? showWordInfos[index].pron_url : null
            })




            //4.循环回调 
            let timer = 0
            if (this.stateRef === null) {
                timer = BackgroundTimer.setTimeout(() => {
                    const nextIndex = (index + 1) % wordCount;
                    this.replay(nextIndex);
                }, interval * 1000);

            } else {
                timer = setTimeout(() => {
                    const nextIndex = (index + 1) % wordCount;
                    this.replay(nextIndex);
                }, interval * 1000);
            }


            //改变curIndex和autoTimer
            this.changeCurIndexAndAutoTimer(source, index, timer);

            //完成学习后，退出
            if (this.finishQuit) {
                this.finishQuit()
            }
        }

    };



    replay = (index) => {
        let source = store.getState().vocaPlay
        if (this.stateRef) {
            source = this.stateRef
        }
        const { autoPlayTimer } = source


        // 回调自动播放
        if (autoPlayTimer) {
            console.log('播放 调度：' + autoPlayTimer)
            this.autoplay(index);
        }
    }

}
