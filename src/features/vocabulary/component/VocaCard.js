import React, {Component} from 'react';
import {Platform, StatusBar,StyleSheet, ScrollView, View, Text, TouchableWithoutFeedback} from 'react-native';
import {PropTypes} from 'prop-types';
import {Grid, Row, Col} from 'react-native-easy-grid'
import { Button } from 'react-native-elements';

import gstyles from '../../../style'
import AliIcon from '../../../component/AliIcon'
import ExampleCarousel from './ExampleCarousel'
import RootCard from './RootCard'
import VocaDao from '../service/VocaDao'
import AudioFetch from '../service/AudioFetch';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    contentContainer:{
        paddingVertical:16,
        backgroundColor:'#F9F9F9',
    },
    grid:{
        marginHorizontal:10,
        backgroundColor:'#F9F9F9',
    },
    basic:{
        backgroundColor:'#FFF',
        padding:10,
        borderRadius:5,
        marginBottom:16
    },
    carousel:{
        backgroundColor:'#FFF',
        borderRadius:5,
        marginBottom:16
    },
    root:{
        backgroundColor:'#FFF',
        borderRadius:5,
        marginBottom:16
    },
    errBtn:{
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:'#888',
        borderRadius:3,
        fontSize:12,
        color:'#888',
        paddingHorizontal:2,
        textAlign:'center',
        marginRight:10,
    },  
    darkFont:{
        color:'#303030',
        fontSize:16,
    },
    grayFont:{
        color:'#505050',
        fontSize:16,
    },
    marginTop:{
        marginTop:10,
    },
   clickView:{
        width:'100%',
        height:height/2,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
   },
   clickText:{
       fontSize:16,
       color:'#555',
   }
})

export default class VocaCard extends Component{

    constructor(props){
        super(props)
        this.state = {
            added:false
        }
        console.disableYellowBox=true

        

        if(this.props.wordInfo){
            this.wordInfo = this.props.wordInfo
        }else{
            // 自动获取
            // VocaDao.getInstance
        }

        this.state = {
            showAll : this.props.showAll,
            wordRoot : null,
            relativeRoots : []
        }
        
        this.audioFetch = AudioFetch.getInstance()
        
    }

    componentDidMount(){
        const wordRoot = VocaDao.getInstance().getWordRoot(this.wordInfo.root_id)
        if(wordRoot){
            const relativeRoots = VocaDao.getInstance().getWordRoots(wordRoot.relatives,3,true)
            this.setState({wordRoot, relativeRoots})
        }
    }

    _genTrans = (transStr)=>{
        const trans = JSON.parse(transStr)
        const comps = []
        if(trans){
            for(let k in trans)
            comps.push(<Text style={styles.darkFont}>{`${k}. ${trans[k]}`}</Text>)
        }
        return comps
    }

    _removeWord = ()=>{

    }
    _addWord = ()=>{

    }
    // 点击显示
    _showAll = ()=>{
        this.setState({showAll:true})
    }

    render(){
        
        return (
            
        <ScrollView style={{ flex: 1 }}
            pagingEnabled={false}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{backgroundColor:'#F9F9F9'}}
            contentContainerStyle={styles.contentContainer}
        >
            <Grid style={styles.grid}>
                <Col>
                    {/* 单词基本信息 */}
                    <Col style={styles.basic}>
                        {/* 单词 */}
                        <Row style={gstyles.r_between}>
                            <Text style={{fontSize:20, fontWeight:'500', color:'#303030'}}>{this.wordInfo.word}</Text>
                            <View style={gstyles.r_end}>
                                <Text style={styles.errBtn}>报错</Text>
                                {this.state.added && //从生词本移除
                                    <AliIcon name='pingfen' size={22} color='#F29F3F' 
                                    style={{marginRight:10}} 
                                    onPress={this._removeWord}/>
                                }
                                {!this.state.added && //添加到生词本
                                    <AliIcon name='malingshuxiangmuicon-' size={22} color='#888' 
                                    style={{marginRight:10}} 
                                    onPress={this._addWord}/>
                                }
                                 <Button
                                    type="outline"
                                    title="词典"
                                    buttonStyle={{height:22,borderColor:'#F29F3F',borderWidth:StyleSheet.hairlineWidth}}
                                    titleStyle={{color:'#F29F3F', fontSize:12, lineHeight:22, paddingBottom:4}}
                                    icon={<AliIcon name='chazhao' size={12} color='#F29F3F' />}
                                />
                            </View>
                        </Row>
                        {/* 音标 */}
                        <Row style={[gstyles.r_start, ]}>
                            <Text style={styles.grayFont}>{this.wordInfo.am_phonetic}</Text>
                            <AliIcon name='shengyin' size={26} color='#F29F3F' style={{marginLeft:10}} onPress={()=>{
                                this.audioFetch.playSound(this.wordInfo.am_pron_url)
                            }}/>
                        </Row>
                        {/* 英英释义 */}
                        <Row style={[gstyles.r_start, styles.marginTop]}>
                            <Text style={styles.grayFont}>{this.wordInfo.def}</Text>
                        </Row>
                        {/* 例句 */}
                        <Row style={[gstyles.r_start_top,styles.marginTop ]}>
                            <Text style={[styles.darkFont, {flex:10}]}>{this.wordInfo.sentence}</Text>
                            <AliIcon name='shengyin' size={26} color='#F29F3F' style={{flex:1,marginLeft:10}} onPress={()=>{
                                this.audioFetch.playSound(this.wordInfo.sen_pron_url)
                            }}/>
                        </Row>
                        {/* 释义 */}
                        {this.state.showAll &&
                            <Row style={styles.marginTop}>
                                <Col>
                                    {
                                        this._genTrans(this.wordInfo.trans)
                                    }
                                </Col>
                            </Row>
                        }
                        {/* 详细词典 */}
                    </Col>
                    {/* 场景例句 */}
                    {this.state.showAll && this.wordInfo.examples.length>0 &&
                        <Col style={styles.carousel}>
                            <ExampleCarousel examples={this.wordInfo.examples}/>
                        </Col>
                    }
                    {/* 词根 */}
                    {this.state.showAll && this.state.wordRoot &&
                        <Col style={styles.root}>
                            <RootCard wordRoot={this.state.wordRoot} relativeRoots={this.state.relativeRoots}/>
                        </Col>
                    }
                    
                    
                </Col>
            </Grid>
             {!this.state.showAll &&
                <TouchableWithoutFeedback onPress={this._showAll}>
                    <View style={styles.clickView}>
                        <Text style={styles.clickText}>点击显示</Text>
                    </View>
                </TouchableWithoutFeedback>
            }
        </ScrollView>

        )
    }
}


VocaCard.propTypes = {
    wordInfo:PropTypes.object.isRequired,
    showAll:PropTypes.boolean
}
  
VocaCard.defaultProps = {
    showAll:true
}