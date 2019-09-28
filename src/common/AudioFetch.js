
import Sound from 'react-native-sound'
import * as CConstant from './constant'
export default class AudioFetch{
  
  constructor(){
    this.sound = null
  }

  //单例模式
  static getInstance(){
    if(!this.instance) {
        this.instance = new AudioFetch();
    }
    return this.instance;
  }


  //播放音频
  playSound = (url,startPlay=null, finishPlay=null,failPlay=null)=>{
    if(startPlay){
      startPlay() //开始播放
    }
    const where = CConstant.RESOURCE_URL+'voca/'+url
    //先暂停并释放资源
    this.releaseSound()

    this.sound = new Sound(where,null, err => {
      //播放失败
      if (err) {        //获取失败
        console.log(err)
        if(failPlay){
          failPlay() //播放失败
        }
        return;
      }
      //播放成功
      this.sound.play(() => {  
        if(finishPlay){
          finishPlay()  //完成播放
        }
      });
    })
    
  }

  //停止播放，释放
  releaseSound = ()=>{
      if(this.sound){
        this.sound.release();
        this.sound = null
      }
  }

}