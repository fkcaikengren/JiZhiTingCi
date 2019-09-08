import React, { Component } from "react";
import {StyleSheet, Text, View,TouchableNativeFeedback} from 'react-native';
import {connect} from 'react-redux'

import * as homeAction from './redux/action/homeAction'
import AliIcon from '../../component/AliIcon'
import TestPage from "./component/TestPage";
import * as Constant from './common/constant'
import vocaUtil from './common/vocaUtil'
import AudioFetch from './service/AudioFetch'

const styles = StyleSheet.create({
    
    content:{
        padding:10,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        height:'35%'
    },
    phoneticView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    wordFont:{
        fontSize:30,
        color:'#202020',
        fontWeight:'600'
    },
    wrongText:{
        position:'absolute',
        bottom:10,
        right:10,
        color:'#EC6760',
        fontSize:16,
    }
});

class TestVocaTranPage extends Component {

    constructor(props){
        super(props);
        console.disableYellowBox=true
    }

    _renderContent = (state)=>{
        const {showWordInfos, curIndex, task} = state
        const words = vocaUtil.getNotPassedWords(task.words)
        const word = showWordInfos[curIndex]?showWordInfos[curIndex].word:''
        const amPronUrl = showWordInfos[curIndex]?showWordInfos[curIndex].am_pron_url:''
        const phonetic = showWordInfos[curIndex]?showWordInfos[curIndex].am_phonetic:''
        const testWrongNum = words[curIndex]?words[curIndex].testWrongNum:0
        return <View  style={styles.content}>
            <View style={{}}>
                <Text style={styles.wordFont}>{word}</Text>
            </View>
            <View style={styles.phoneticView}>
                <Text>{'[美]'+phonetic}</Text>
                <AliIcon name='shengyin' size={26} color='#555' style={{marginLeft:5}} onPress={()=>{
                    AudioFetch.getInstance().playSound(amPronUrl)
                }}/>
            </View>
            <Text style={styles.wrongText}>{`答错${testWrongNum}次`}</Text>
        </View>
    }
 
    render() {
        return (
            <TestPage 
                {...this.props}
                mode='study'
                type={Constant.WORD_TRAN}
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


export default connect(mapStateToProps, mapDispatchToProps)(TestVocaTranPage)