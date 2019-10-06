import React, { Component } from "react";
import {StyleSheet, Text, View,TouchableNativeFeedback} from 'react-native';
import {connect} from 'react-redux'

import * as homeAction from './redux/action/homeAction'
import * as vocaPlayAction from './redux/action/vocaPlayAction'
import AliIcon from '../../component/AliIcon'
import TestPage from "./component/TestPage";
import * as Constant from './common/constant'
import vocaUtil from './common/vocaUtil'
import AudioService from '../../common/AudioService'
import * as VocaLibAction from "./redux/action/vocaLibAction";
import * as CConstant from "../../common/constant";
import gstyles from "../../style";

const styles = StyleSheet.create({
    content:{
        padding:10,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        height:'35%'
    },
    senFont:{
        flex:10,
        textAlign:'left',
        lineHeight:24,
    },
    wrongText:{
        position:'absolute',
        bottom:10,
        right:10,
        color:'#EC6760',
        fontSize:18,
    }
});

class TestSenVocaPage extends Component {

    constructor(props){
        super(props);
        console.disableYellowBox=true
    }

    _renderContent = (state)=>{
        const {showWordInfos, curIndex, task, showAnswer} = state
        const sentence = showWordInfos[curIndex]?showWordInfos[curIndex].sentence:null
        const pronUrl =  showWordInfos[curIndex]?showWordInfos[curIndex].sen_pron_url:null
        const words = vocaUtil.getNotPassedWords(task.words)
        const testWrongNum = words[curIndex]?words[curIndex].testWrongNum:0
        let sen = ''
        if(sentence){
            const s = sentence.split(/<em>|<\/em>/)
            sen = s.map((text, index)=>{
                if(index%2 === 0){
                  return text
                }else{
                  return <Text style={[gstyles.lg_black,{color:showAnswer?'#1890FF':'#F2753F',}]}>{showAnswer?text:'____'}</Text>
                }
            })
        }
        return <View  style={styles.content}>
           <Text style={[styles.senFont,gstyles.lg_black]}> {sen} </Text>
           <AliIcon name='shengyin' size={26} color='#F29F3F' 
            style={{flex:1}}
            onPress={()=>{
                AudioService.getInstance().playSound({
                    pDir : CConstant.VOCABULARY_DIR,
                    fPath : pronUrl
                })
            }}/>

            <Text style={styles.wrongText}>{`答错${testWrongNum}次`}</Text>
        </View>
    }
 
    //监听选择后的结果
    render() {
        return (
            <TestPage 
                {...this.props}
                mode={this.props.navigation.getParam('mode')}
                type={Constant.TRAN_WORD}
                // playType='sentence'
                testTime={16}
                renderContent={this._renderContent}
            />
        )
    }
}



const mapStateToProps = state=>({
    home:state.home,
    vocaPlay: state.vocaPlay
})

const mapDispatchToProps = {
    updateTask: homeAction.updateTask,
    uploadTask: homeAction.uploadTask,
    changeLearnedWordCount : VocaLibAction.changeLearnedWordCount,
    updatePlayTask: vocaPlayAction.updatePlayTask
}


export default connect(mapStateToProps, mapDispatchToProps)(TestSenVocaPage)