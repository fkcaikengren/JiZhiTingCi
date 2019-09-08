import React, { Component } from "react";
import {StyleSheet, Text, View,TouchableWithoutFeedback, Image} from 'react-native';
import {connect} from 'react-redux'

import * as homeAction from './redux/action/homeAction'
import AliIcon from '../../component/AliIcon'
import TestPage from "./component/TestPage";
import * as Constant from './common/constant'
import AudioFetch from './service/AudioFetch'

const styles = StyleSheet.create({
    
    content:{
        padding:10,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        height:'35%'
    },
    img:{
        width:60,
        height:60
    },
    wrongText:{
        position:'absolute',
        bottom:10,
        right:10,
        color:'#EC6760',
        fontSize:16,
    }
});

class TestPronTranPage extends Component {

    constructor(props){
        super(props);

        this.state = {
            isPlaying : false
        }

        console.disableYellowBox=true

    }

    _startPlay = ()=>{  
        this.setState({isPlaying:true})
    }

    _finishPlay = ()=>{
        setTimeout(()=>{
            this.setState({isPlaying:false})
        },1000)
    }
    _failPlay = ()=>{
        this.setState({isPlaying:false})
    }

    _renderContent = (state)=>{
        const {showWordInfos, curIndex, task} = state
        const amPronUrl = showWordInfos[curIndex]?showWordInfos[curIndex].am_pron_url:''
        const words = vocaUtil.getNotPassedWords(task.words)
        const testWrongNum = words[curIndex]?words[curIndex].testWrongNum:0
        return <View  style={styles.content}>
            {!this.state.isPlaying &&
                <AliIcon name='shengyin' size={60} color='#F29F3F' 
                style={{paddingTop:3}}
                onPress={()=>{
                    AudioFetch.getInstance().playSound(amPronUrl,this._startPlay,this._finishPlay,this._failPlay)
                }}/>
            }
           
            {this.state.isPlaying &&
                <TouchableWithoutFeedback onPress={()=>{
                    AudioFetch.getInstance().playSound(amPronUrl)
               }}>
                   <Image source={require('../../image/audio.gif')} style={styles.img}/>
               </TouchableWithoutFeedback>
            }
            <Text style={styles.wrongText}>{`答错${testWrongNum}次`}</Text>
        </View>
    }
 
    render() {
        return (
            <TestPage 
                {...this.props}
                mode='study'
                type={Constant.PRON_TRAN}
                renderContent={this._renderContent}
            />
        )
    }
}



const mapStateToProps = state=>({
    home:state.home
})

const mapDispatchToProps = {
    updateTask: homeAction.updateTask
}


export default connect(mapStateToProps, mapDispatchToProps)(TestPronTranPage)