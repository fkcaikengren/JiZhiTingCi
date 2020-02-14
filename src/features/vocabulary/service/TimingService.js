
import BackgroundTimer from 'react-native-background-timer'
import RNExitApp from 'react-native-exit-app';
import NotificationManage from '../../../modules/NotificationManage'
import { store } from '../../../redux/store'

export default class TimingService {

    constructor({ timingRef, setContentState, changeWholeSeconds, decreaseSecond, changePlayTimer }) {
        this.timingRef = timingRef
        this.setContentState = setContentState
        this.changeWholeSeconds = changeWholeSeconds
        this.decreaseSecond = decreaseSecond
        this.changePlayTimer = changePlayTimer

        this.timer = null
    }

    //单例模式
    static getInstance() {
        if (!this.instance) {
            this.instance = new TimingService({
                timingRef: null,
                setContentState: null,
                changeWholeSeconds: null,
                decreaseSecond: null,
                changePlayTimer: null
            });
        }
        return this.instance;
    }


    countDown = (i, item) => {
        //清除之前的定时
        if (this.timer) {
            BackgroundTimer.clearInterval(this.timer)
        }
        this.setContentState({
            selectedIndex: i,
            leftSeconds: item * 60
        })
        // 设置时间
        this.changeWholeSeconds({ timeIndex: i, wholeSeconds: item * 60 })
        if (i === 0) {
            return
        }
        // 倒计时
        this.timer = BackgroundTimer.setInterval(() => {
            const { wholeSeconds } = store.getState().timing
            console.log('----后台-----wholeSeconds：' + wholeSeconds)
            if (wholeSeconds > 0) {
                this.setContentState({ leftSeconds: wholeSeconds - 1 })
                this.decreaseSecond()
            } else {
                //注意：后台播放时退出，timing不会持久化
                this.changeWholeSeconds({ timeIndex: 0, wholeSeconds: 0 })
                const { autoPlayTimer } = store.getState().vocaPlay
                if (autoPlayTimer) {
                    BackgroundTimer.clearTimeout(autoPlayTimer);
                }
                this.changePlayTimer(0);
                NotificationManage.pause((e) => {
                    console.log(e)
                }, () => null);
                BackgroundTimer.setTimeout(() => {
                    if (this.timer) {
                        BackgroundTimer.clearInterval(this.timer)
                    }
                    RNExitApp.exitApp();
                }, 500)
            }
        }, 1000);
    }

}