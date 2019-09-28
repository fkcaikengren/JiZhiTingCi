
import {BackHandler} from 'react-native'
import BackgroundTimer from 'react-native-background-timer';
import AudioFetch from '../../../common/AudioFetch'
import {store} from '../../../redux/store' 
import NotificationManage from '../../../modules/NotificationManage'


export default class VocaPlayService{

    constructor({listRef, stateRef, changeCurIndex, changePlayTimer, finishQuit=null,}){

        this.listRef = listRef
        this.stateRef = stateRef
        this.changeCurIndex = changeCurIndex
        this.changePlayTimer = changePlayTimer
        this.finishQuit = finishQuit

        this.audioFetch = AudioFetch.getInstance()

        //监听关闭通知控制条
        NotificationManage.onClose((evt)=>{
            BackHandler.exitApp();
        })

        //监听通知控制条的暂停
        NotificationManage.onPause((evt)=>{
            console.log('--窗口发送暂停--')
            let source = store.getState().vocaPlay
            if(this.stateRef){
                source = this.stateRef
            }
            const {autoPlayTimer} = source
            this.changePlayTimer(0)
            BackgroundTimer.clearTimeout(autoPlayTimer);
        })

        //监听通知控制条的播放
        NotificationManage.onPlay((evt)=>{
            console.log('--窗口发送播放--')
            let source = store.getState().vocaPlay
            if(this.stateRef){
                source = this.stateRef
            }
            const {curIndex} = source
            this.autoplay(curIndex)
        })

        console.log("stateRef")
        console.log(stateRef)
    }
    //单例模式
    static getInstance(){
        if(!this.instance) {
            this.instance = new VocaPlayService({listRef:null,stateRef:null,
                changeCurIndex:null, changePlayTimer:null, finishQuit:null,});
        }
        return this.instance;
    }

    
    setStateRef = (state)=>{
        console.log(state)
        this.stateRef = {...this.stateRef, ...state}
        
    }

    

    /**
     * @description 自动播放 
     */
    autoplay = (index) => {
        let source = store.getState().vocaPlay
        if(this.stateRef){
            source = this.stateRef
        }

        const {task, showWordInfos,curIndex, interval,autoPlayTimer} = source
        const { wordCount} = task 


        // 1.滑动 {animated: boolean是否动画, index: item的索引, viewPosition:视图位置（0-1） };
        let params = { animated:true, index, viewPosition:0.5 };
        if(wordCount > 0){
            if (this.listRef) { 
                console.log('move');
                this.listRef.scrollToIndex(params);
            }
            //2.更新通知栏的单词
            if(this.stateRef === null){
                NotificationManage.updateWord(showWordInfos[curIndex].word, (e)=>{console.log(e)}, 
                ()=>{console.log('--更新通知栏单词成功--')})
            }

            //3.播放单词音频
            this.audioFetch.playSound(showWordInfos[curIndex].am_pron_url)

            //4.循环回调
            let timer = 0
            if(this.stateRef === null){
                timer = BackgroundTimer.setTimeout(() => {
                    const nextIndex = (index + 1) % wordCount;
                    this.replay(  nextIndex);
                }, interval * 1000);
            }else{
                timer = setTimeout(() => {
                    const nextIndex = (index + 1) % wordCount;
                    this.replay(  nextIndex);
                }, interval * 1000);
            }

            console.log('------'+timer)
            this.changePlayTimer(timer);     //改变


            //完成学习后，退出
            if(this.finishQuit){
                this.finishQuit()
            }
        }
        
    };
  


    replay = (index) => {
        let source = store.getState().vocaPlay
        if(this.stateRef){
            source = this.stateRef
        }
        const {autoPlayTimer} = source

        //改变单词下标
        this.changeCurIndex(index);

        // 回调自动播放
        if (autoPlayTimer) {
            console.log('播放 调度：'+autoPlayTimer)
            this.autoplay(index);  
        }
    }


}