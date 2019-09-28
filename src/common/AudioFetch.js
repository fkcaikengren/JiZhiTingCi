
import Sound from 'react-native-sound'

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
    const baseUrl = 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/'
    console.log(baseUrl+url)
    //先暂停并释放资源
    this.releaseSound()

    this.sound = new Sound(baseUrl+url,null, err => {
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