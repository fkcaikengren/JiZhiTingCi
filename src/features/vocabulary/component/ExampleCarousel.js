import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, TouchableNativeFeedback } from 'react-native'
import Swiper from 'react-native-swiper'
import { PropTypes } from 'prop-types'
import LinearGradient from 'react-native-linear-gradient';
const Spinner = require('react-native-spinkit');
import AudioService from '../../../common/AudioService'
import * as CConstant from "../../../common/constant";
import { BASE_URL } from "../../../common/constant";
import { store } from '../../../redux/store';
import FileService from '../../../common/FileService';
import gstyles from '../../../style';
const { width } = Dimensions.get('window')


const styles = StyleSheet.create({
  wrapper: {
    width: width - 20,
    height: 0.5617 * (width - 20)
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    width: width - 20,
    height: 0.5617 * (width - 20),
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,.1)'
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 5,
  },
  origin: {
    position: 'absolute',
    top: 5,
    left: 5,
    color: '#FFFFFFAA',
    fontSize: 12,
  },
  bottomView: {
    position: 'absolute',
    bottom: 5,
    width: '100%',
    paddingHorizontal: 5,
    backgroundColor: 'transparent',
  },
  dotPosition: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  }

})



export default class ExampleCarousel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadQueue: new Array(this.props.examples.length).fill(0),
      imgSources: new Array(this.props.examples.length).fill(null)
    }
    this.audioService = AudioService.getInstance()
    this.fileService = FileService.getInstance()
    this.curIndex = 0
    this.shouldPlay = true
  }



  shouldComponentUpdate(nextProps, nextState) {

    if (this.state.loadQueue !== nextState.loadQueue) {
      return true
    }
    if (this.state.imgSources !== nextState.imgSources) {
      return true
    }
    if (this.props.examples === nextProps.examples) {
      return false
    } else {

      this.setState({
        loadQueue: new Array(nextProps.examples.length).fill(0),
        imgSources: new Array(nextProps.examples.length).fill(null)
      })

      if (this._swiper && this.curIndex !== 0) {
        this._swiper.scrollBy(0 - this.curIndex, false)
        this.shouldPlay = false
      }
    }
    return true

  }

  _loadHandle = async (i, pic_url) => {
    let loadQueue = this.state.loadQueue

    loadQueue[i] = 1
    //下载（缓存）图片
    const imgSource = await this.fileService.load(CConstant.VOCABULARY_DIR, pic_url)
    const imgSources = this.state.imgSources.map((source, index) => {
      if (i === index) {
        return imgSource
      } else {
        return source
      }
    })
    console.log(imgSource)
    this.setState({
      loadQueue,
      imgSources
    })
  }


  _renderText = (text) => {
    if (text.includes('<em>') && text.includes('</em>')) {
      const s = text.split(/<em>|<\/em>/)
      return <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '500' }}>
        {
          s.map((text, index) => {
            if (index % 2 === 0) {
              const words = text.split(' ')
              return words.map((word, i) => <Text
                key={word + index + i}
                onPress={() => this.props.lookWord(word)}
              >{word} </Text>)
            } else {
              return <Text key={text + index} style={{ color: '#F2753F', fontSize: 14, fontWeight: '500' }}>{text}</Text>
            }
          })
        }
      </Text>
    } else {
      const words = text.split(' ')
      return <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '500' }}>
        {
          words.map((word, i) => <Text
            key={word + i}
            onPress={() => this.props.lookWord(word)}
          >{word} </Text>)
        }
      </Text>

    }
  }

  render() {
    const { configShowMTrans } = store.getState().mine
    return (
      <Swiper
        ref={ref => this._swiper = ref}
        style={styles.wrapper}
        showsPagination={true}
        paginationStyle={styles.dotPosition}
        dotColor='#FFFFFFAA'
        activeDotColor='#FFE957'
        loop={false}
        loadMinimal
        loadMinimalSize={1}
        onIndexChanged={(i) => {
          this.curIndex = i
          if (!this.shouldPlay) {
            this.shouldPlay = true
          } else {
            this.audioService.playSound({
              pDir: CConstant.VOCABULARY_DIR,
              fPath: this.props.examples[i] ? this.props.examples[i].pron_url : null
            })
          }
        }}
      >
        {
          this.props.examples.map((item, i) => {
            return <View key={i.toString()} style={styles.slide}>
              <View>
                <Image style={styles.image}
                  onLoad={() => this._loadHandle(i, item.pic_url)}
                  source={this.state.imgSources[i]} />
              </View>
              {this.state.loadQueue[i] == 0 &&
                <View style={[gstyles.c_center, styles.image]}>
                  <Spinner
                    isVisible={true}
                    size={40}
                    type={'Circle'}
                    color={gstyles.mainColor}
                  />
                </View>
              }
              <TouchableNativeFeedback onPress={() => {
                this.audioService.playSound({
                  pDir: CConstant.VOCABULARY_DIR,
                  fPath: item.pron_url
                })
              }}>
                <LinearGradient
                  colors={["#000000ee", "#00000055", "#00000011"]} style={styles.linearGradient}
                  start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}
                />
              </TouchableNativeFeedback>

              <Text style={styles.origin}>{item.origin}</Text>
              <View style={styles.bottomView}>
                {this._renderText(item.sen)}
                {configShowMTrans &&
                  <Text style={{ color: '#FFFFFFCC', fontSize: 12 }}>{item.sen_tran}</Text>
                }
              </View>
            </View>
          })
        }
      </Swiper>
    )
  }
}




ExampleCarousel.propTypes = {
  examples: PropTypes.object.isRequired,
}

ExampleCarousel.defaultProps = {
  examples: []
}