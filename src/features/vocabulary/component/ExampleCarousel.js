import React, { Component } from 'react'
import { StyleSheet,Text, View, Image, Dimensions, TouchableWithoutFeedback} from 'react-native'
import Swiper from 'react-native-swiper'
import {PropTypes} from 'prop-types';
import AudioFetch from '../service/AudioFetch'

const { width } = Dimensions.get('window')
const Location = 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/'

const styles = StyleSheet.create({
    wrapper: {
        width:width-20,
        height:0.5617*(width-20)
    },

    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    image: {
        width:width-20,
        height:0.5617*(width-20),
        borderRadius:5,
        backgroundColor: '#FFE957',
    },

    origin:{
        position:'absolute',
        top:5,
        left:5,
        color:'#FFFFFFAA',
        fontSize:12,
    },
    bottomView:{
        position:'absolute',
        bottom:5,
        width:'100%',
        paddingHorizontal:5,
        backgroundColor: 'transparent',
    },
    dotPosition:{
      position:'absolute',
      top:5,
      right:5,
      flexDirection:'row',
      justifyContent:'flex-end',
      alignItems:'flex-start',
    }

})



export default class ExampleCarousel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loadQueue: [0, 0, 0]
    }
    this.audioFetch = AudioFetch.getInstance()
  }

  _loadHandle (i) {
    let loadQueue = this.state.loadQueue
    loadQueue[i] = 1
    this.setState({
      loadQueue
    })
  }
  _renderText = (text)=>{
    const s = text.split(/<em>|<\/em>/)
    return <Text style={{color:'#FFF', fontSize:14, fontWeight:'500'}}>
        {
          s.map((text, index)=>{
              if(index%2 === 0){
                return text
              }else{
                return <Text style={{color:'#F2753F',fontSize:14, fontWeight:'500' }}>{text}</Text>
              }
          })
        }
    </Text>
  }
 
  render () {
    return (
        <Swiper 
        style={styles.wrapper} 
        showsPagination={true}
        paginationStyle={styles.dotPosition}
        dotColor='#FFFFFFAA'
        activeDotColor='#FFE957'
        loop={false} 
        onIndexChanged={(i)=>{
          this.audioFetch.playSound(this.props.examples[i].pron_url)
        }}
        loadMinimal loadMinimalSize={1} >
            {
                this.props.examples.map((item, i)=>{
                    return <View style={styles.slide}>
                        <TouchableWithoutFeedback onPress={()=>{
                          this.audioFetch.playSound(item.pron_url)
                        }}>
                          <Image onLoad={()=>{this._loadHandle(i)}} style={styles.image} source={{uri: Location+item.pic_url}} />
                        </TouchableWithoutFeedback>
                        <Text style={styles.origin}>{item.origin}</Text>
                        <View style={styles.bottomView}>
                            {this._renderText(item.sen)}
                            <Text style={{color:'#FFFFFFCC',fontSize:12}}>{item.sen_tran}</Text>
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
    examples:[]
}