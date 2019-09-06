
import Sound from 'react-native-sound'



export const playSound = (url)=>{
    const baseUrl = 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/'
    console.log(baseUrl+url)
    const sound = new Sound(baseUrl+url,null, err => {
      console.log('play')
      if (err) {        //获取失败
        console.log(err)
        return;
      }
      sound.play(() => {  //播放
        console.log('success play')
        sound.release();
      });
    })
    
}

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

  fn = ()=>null
  
  //播放音频
  playSound = (url,startPlay=this.fn, finishPlay=this.fn,failPlay=this.fn)=>{
    startPlay() //开始播放
    const baseUrl = 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/'
    console.log(baseUrl+url)
    //先暂停
    if(this.sound){
      this.sound.pause();
      this.sound.release();
    }
    this.sound = new Sound(baseUrl+url,null, err => {
      console.log('play')
      if (err) {        //获取失败
        console.log(err)
        failPlay() //播放失败
        this.sound.release();
        this.sound = null
        return;
      }
      this.sound.play(() => {  
        finishPlay()  //完成播放
        console.log('success play')
        this.sound.release();
        this.sound = null
      });
    })
    
}

}