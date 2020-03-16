
import Sound from 'react-native-sound'
import FileService from "./FileService";
export default class AudioService {

  constructor() {
    this.sound = null
    this.fileService = FileService.getInstance()
  }

  //单例模式
  static getInstance() {
    if (!this.instance) {
      this.instance = new AudioService();
    }
    return this.instance;
  }


  /**
   *  播放音频
   * @param primaryDir
   * @param filePath
   * @param startPlay
   * @param finishPlay
   * @param failPlay
   */
  playSound = ({ pDir, fPath }, startPlay = null, finishPlay = null, failPlay = null) => {

    //先判断本地是否存在
    this.fileService.load(pDir, fPath)
      .then(audioPath => {
        // console.log(audioPath)
        if (!audioPath) {   //音频查找失败,播放失败
          if (failPlay) {
            failPlay()
          }
          return;
        }

        if (startPlay) {
          startPlay() //开始播放
        }
        //先暂停并释放资源
        this.releaseSound()
        this.sound = new Sound(audioPath, null, err => {
          //播放失败
          if (err) {        //获取失败
            console.log(err)
            if (failPlay) {
              failPlay() //播放失败
            }
            return;
          }
          //播放成功
          if (this.sound) {
            this.sound.play(() => {
              if (finishPlay) {
                finishPlay()  //完成播放
              }
            });
          } else {
            if (failPlay) {
              failPlay() //播放失败
            }
            return;
          }
        })
      })
      .catch(e => {
        console.log(e)
        if (failPlay) {
          failPlay() //播放失败
        }
      })


  }

  /**
   *  释放播放资源
   */
  releaseSound = () => {
    if (this.sound) {
      this.sound.release();
      this.sound = null
    }
  }

}