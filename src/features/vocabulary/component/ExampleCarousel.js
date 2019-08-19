import React, { Component } from 'react'
import { Text, View, Image, Dimensions, StyleSheet} from 'react-native'
import Swiper from 'react-native-swiper'
import {PropTypes} from 'prop-types';
import Loader from '../../../component/Loader';

const { width } = Dimensions.get('window')


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
        backgroundColor: 'transparent'
    }

})



export default class ExampleCarousel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loadQueue: [0, 0, 0]
    }
  }
  _loadHandle (i) {
    let loadQueue = this.state.loadQueue
    loadQueue[i] = 1
    this.setState({
      loadQueue
    })
  }
  _renderText = (text)=>{
    const s = text.split(/<em>|<em\/>/)
    return <Text style={{color:'#FFF', fontSize:14, fontWeight:'500'}}>
        {s[0]}
        <Text style={{color:'#F2753F',fontSize:14, fontWeight:'500' }}>{s[1]}</Text>
        {s[2]}
    </Text>
  }
  render () {
    return (
        <Swiper 
        style={styles.wrapper} 
        showsPagination={false}
        loop={false} 
        loadMinimal loadMinimalSize={1} >
            {
                this.props.examples.map((item, i)=>{
                    return <View style={styles.slide}>
                        <Image onLoad={()=>{this._loadHandle(i)}} style={styles.image} source={{uri: item.pic_url}} />
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
   examples: PropTypes.object.isRequired
}
  
ExampleCarousel.defaultProps = {
    examples:[]
}