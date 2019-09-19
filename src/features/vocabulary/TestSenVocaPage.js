import React, { Component } from "react";
import {StyleSheet, Text, View,TouchableNativeFeedback} from 'react-native';
import {connect} from 'react-redux'

import * as homeAction from './redux/action/homeAction'
import * as vocaPlayAction from './redux/action/vocaPlayAction'
import AliIcon from '../../component/AliIcon'
import TestPage from "./component/TestPage";
import * as Constant from './common/constant'
import vocaUtil from './common/vocaUtil'
import AudioFetch from './service/AudioFetch'

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
        color:'#303030',
        fontSize:16,
        textAlign:'left'
    },
    wrongText:{
        position:'absolute',
        bottom:10,
        right:10,
        color:'#EC6760',
        fontSize:16,
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
                  return <Text style={{color:showAnswer?'#1890FF':'#F2753F',fontSize:16 }}>{showAnswer?text:'____'}</Text>
                }
            })
        }
        return <View  style={styles.content}>
           <Text style={styles.senFont}> {sen} </Text>
           <AliIcon name='shengyin' size={26} color='#F29F3F' 
            style={{flex:1}}
            onPress={()=>{
                AudioFetch.getInstance().playSound(pronUrl)
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
                playType='sentence'
                testTime={16}
                renderContent={this._renderContent}
            />
        )
    }
}



const mapStateToProps = state=>({
    home:state.home
})

const mapDispatchToProps = {
    updateTask: homeAction.updateTask,
    setShouldUpload: homeAction.setShouldUpload,

    updatePlayTask: vocaPlayAction.updatePlayTask
}


export default connect(mapStateToProps, mapDispatchToProps)(TestSenVocaPage)