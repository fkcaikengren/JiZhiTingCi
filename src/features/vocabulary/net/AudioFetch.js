
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