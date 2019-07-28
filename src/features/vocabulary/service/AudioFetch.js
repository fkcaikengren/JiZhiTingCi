
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


        // let wordAudio = new Sound(words[index].word+'.wav', Sound.MAIN_BUNDLE, (error) => {
        //     if (error) {
        //       console.log('failed to load the sound', error);
        //       return;
        //     }
        //     // loaded successfully
        //     // console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
          
        //     // Play the sound with an onEnd callback
        //     wordAudio.play((success) => {
        //       if (success) {
        //         console.log('successfully finished playing');
        //         wordAudio.release();
        //       } else {
        //         console.log('playback failed due to audio decoding errors');
        //     }
        //     });
        // });