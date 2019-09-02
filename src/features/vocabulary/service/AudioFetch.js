
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

  //播放音频
  playSound = (url)=>{
    const baseUrl = 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/'
    console.log(baseUrl+url)
    //先暂停
    if(this.sound){
      this.sound.pause();
      this.sound.release();
    }
    //再重新构建一个声音播放
    this.sound = new Sound(baseUrl+url,null, err => {
      console.log('play')
      if (err) {        //获取失败
        console.log(err)
        this.sound.release();
        this.sound = null
        return;
      }
      this.sound.play(() => {  //播放
        console.log('success play')
        this.sound.release();
        this.sound = null
      });
    })
    
}

}