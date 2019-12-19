import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import {PropTypes} from 'prop-types';
import Modal from 'react-native-modalbox'

import VocaDao from '../service/VocaDao'
import gstyles from "../../../style";
import AliIcon from '../../../component/AliIcon'
import AudioService from "../../../common/AudioService";
import VocaGroupService from '../../vocabulary/service/VocaGroupService'
import VocaCard from "./VocaCard";
import * as CConstant from "../../../common/constant";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default class LookWordBoard extends Component{

    constructor(props){
        super(props);
        this.state={
            isOpen : false,
            wordInfo : null,
            added: false,
        }
        this.vocaDao = VocaDao.getInstance()
        this.vgService = new VocaGroupService()
        this.audioService = AudioService.getInstance()
    }

    lookWord = (text)=>{
        const reg = /[a-z]+[\-’]?[a-z]*/i
        const res = text.match(reg)
        let added = false
        if(res[0]){
            const wordInfo = this.vocaDao.lookWordInfo(res[0])
            if(wordInfo){
                //判断是否存在
                added = this.vgService.isExistInDefault(wordInfo.word)
                this.setState({isOpen:true, wordInfo, added})
                this.props.onStateChange(true)
                return true
            }
        }
        this.setState({isOpen:true, wordInfo:res[0]?res[0]:'', added})
        this.props.onStateChange(true)
        return false
    }



    _closeWordBoard = ()=>{
        this.setState({isOpen:false})
        this.props.onStateChange(false)
    }

    _openWordBoard = ()=>{
        this.setState({isOpen:true})
        this.props.onStateChange(true)
    }

    _genTrans = (transStr)=>{
        const trans = JSON.parse(transStr)
        const comps = []
        if(trans){
            for(let k in trans)
                comps.push(<View style={[gstyles.r_start,{width:width-70}]}>
                    <Text numberOfLines={1} style={[{width:40,lineHeight:22},gstyles.md_black]}>{k+'.'}</Text>
                    <Text numberOfLines={1} style={[gstyles.md_black,{lineHeight:22}]}>{trans[k]}</Text>
                </View>)
        }
        return comps
    }
    _addWord = ()=>{
        const {wordInfo} = this.state
        const groupWord = {
            word:  wordInfo.word,
            enPhonetic:  wordInfo.en_phonetic,
            enPronUrl:  wordInfo.en_pron_url,
            amPhonetic:  wordInfo.am_phonetic,
            amPronUrl:  wordInfo.am_pron_url,
            trans:  wordInfo.trans
        }
        if(this.vgService.addWordToDefault(groupWord)){
            this.setState({added:true})
        }
    }

    _removeWord = ()=>{
        const word = this.state.wordInfo.word
        if(this.vgService.removeWordFromDefault(word)){
            this.setState({added:false})
        }
    }

    _renderContent = ()=>{
        const wordInfo = this.state.wordInfo
        if(typeof wordInfo === 'string'){
            return <View style={[gstyles.c_start,styles.content]}>
                <Text style={gstyles.xl_black_bold}>{wordInfo}</Text>
                <View style={[gstyles.c_center,{marginTop:10}]}>
                    <AliIcon name={'nodata_icon'} size={60} color={gstyles.black} />
                    <Text style={gstyles.md_black}>呜呜~没查到...</Text>
                </View>
            </View>
        }else{
            return <View style={[gstyles.c_start,styles.content]}>
                {/*单词*/}
                <View style={[{width:'100%'},gstyles.r_between]}>
                    <Text style={gstyles.xl_black_bold}>{wordInfo.word}</Text>
                    <View style={gstyles.r_end}>
                        <Text style={gstyles.errBtn}>报错</Text>
                        {this.state.added && //从生词本移除
                        <AliIcon name='pingfen' size={22} color={gstyles.secColor}
                                    style={{marginRight:5}}
                                    onPress={this._removeWord}/>
                        }
                        {!this.state.added && //添加到生词本
                        <AliIcon name='malingshuxiangmuicon-' size={22} color='#888'
                                    style={{marginRight:5}}
                                    onPress={this._addWord}/>
                        }
                    </View>
                </View>
                {/*y音标*/}
                <View style={[{width:'100%',marginTop:10},gstyles.r_start]}>
                    <Text style={gstyles.sm_gray}>美</Text>
                    <Text style={gstyles.sm_gray}>{wordInfo.am_phonetic}</Text>
                    <AliIcon name='shengyin' size={24} color={gstyles.secColor} style={{marginLeft:6}} onPress={()=>{
                        this.audioService.playSound({
                            pDir : CConstant.VOCABULARY_DIR,
                            fPath : wordInfo.am_pron_url
                        })

                    }}/>
                    <Text style={[gstyles.sm_gray,{marginLeft:10}]}>英</Text>
                    <Text style={gstyles.sm_gray}>{wordInfo.en_phonetic}</Text>
                    <AliIcon name='shengyin' size={24} color={gstyles.secColor} style={{marginLeft:6}} onPress={()=>{
                        this.audioService.playSound({
                            pDir : CConstant.VOCABULARY_DIR,
                            fPath : wordInfo.en_pron_url
                        })

                    }}/>
                </View>
                {/*  释义*/}
                <View style={{width:'100%', marginTop:10}}>
                    {
                        this._genTrans(wordInfo.trans)
                    }
                </View>
            </View>
              
        }
         
    }

    render(){
        const wordInfo = this.state.wordInfo
        return <Modal style={styles.modal}
            isOpen={this.state.isOpen} 
            onClosed={this._closeWordBoard}
            onOpened={this._openWordBoard}
            backdrop={true} 
            backdropPressToClose={true}
            swipeToClose={false}
            position={"bottom"}
            ref={ref => {
                this.wordBoard = ref
            }}>
            {wordInfo &&
                <View style={[gstyles.c_start]}>
                    <View style={[gstyles.r_center,styles.dropBar]}>
                        <Text style={gstyles.lg_black}>释义  </Text>
                        <AliIcon name={'cha'} color={'#555'} size={16} style={{position:'absolute',right:20}}
                                 onPress={this._closeWordBoard}/>
                    </View>
                    {
                        this._renderContent()
                    }
                </View>
            }

        
        </Modal>
    }
}

const styles = StyleSheet.create({
    modal: {
        width:width,
        height: 240,
        backgroundColor: "#FDFDFD",
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
    },
    content:{
        width:width,
        padding:15,
    },

    dropBar:{
        width:width,
        height:45,
        borderBottomColor:'#AAA',
        borderBottomWidth:StyleSheet.hairlineWidth,
    },
})

LookWordBoard.propTypes = {
    onStateChange : PropTypes.func,

}

LookWordBoard.defaultProps = {
    onStateChange : (isOpen)=>null,
}