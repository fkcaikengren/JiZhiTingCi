import React, { Component } from 'react';
import {StyleSheet, View, Text,  TouchableHighlight} from 'react-native';
import { Container, Header, Content, Grid, Row, Col, } from 'native-base';
import {PropTypes} from 'prop-types';
import AliIcon from '../../../component/AliIcon'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import VocaGroupDao from '../service/VocaGroupDao'
import {playSound} from '../service/AudioFetch'
import DictCard from './DictCard';
import gstyles from '../../../style'
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container:{
    marginTop:30,
    backgroundColor:'#F0F0F0',
    width:width,
  },  
  wordRow:{
    paddingTop:5,
    backgroundColor:'#FDFDFD'
  },
  word:{
    fontSize:22,
    fontWeight:'500',
    color:'#101010',
    marginLeft:10,
  },
  errBtn:{
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:'#888',
    borderRadius:3,
    fontSize:12,
    color:'#888',
    paddingHorizontal:2,
    textAlign:'center',
    marginRight:20,
  },  
  iconText:{
      height:20,
      textAlign:'center',
      color:'#FFF',
      backgroundColor:'#F2753F',
      borderRadius:2,
      marginLeft:10,
      marginRight: 10,
  },
  property:{
    width:width,
    height:50,
    backgroundColor:'#FDFDFD',
    marginBottom:10,
  },
  phonetic:{
      fontSize: 14,
      color: '#101010',
  }
});


export default class DetailDictPage extends Component {

  static propTypes = {
    word: PropTypes.string.isRquired,
    vocaDao: PropTypes.object.isRequired,
    vocaGroupDao: PropTypes.object,
  }

  // 组件参数默认属性
  static defaultProps = {
    word:'',
    vocaDao:null,
    vocaGroupDao: null,
  }

  constructor(props){
    super(props);
    this.state = {
      wordDict:{}, 
      added:false
    }
    
  }

  componentDidMount(){
    console.log(this.props.vocaDao);
    //打开数据库，查询单词详情
    let wordDict = {}
    wordDict = this.props.vocaDao.getWordDetail(this.props.word)
     //打开数据库，查询生词本信息
    if(this.props.vocaGroupDao){
      if(this.props.vocaGroupDao.isExistInDefault(this.props.word)){
        this.setState({added:true})
      }
    }else{
      this.vocaGroupDao = new VocaGroupDao()
      this.vocaGroupDao.open()
      .then(()=>{
          //判断是否存在默认生词本中
          if(this.vocaGroupDao.isExistInDefault(this.props.word)){
            this.setState({added:true})
          }
      })
    }
    this.setState({wordDict});
  }
  
  componentWillUnmount(){
    
    if(this.vocaGroupDao){
      this.vocaGroupDao.close();
      // alert('detailDictPage out, close realm');
    }
  }

  _addWord = ()=>{
    const {word, properties} = this.state.wordDict         
    let groupWord = {
      word: word,
      enPhonetic: properties?properties[0].enPhonetic:'',
      enPronUrl: properties?properties[0].enPronUrl:'',
      amPhonetic: properties?properties[0].amPhonetic:'',
      amPronUrl: properties?properties[0].amPronUrl:'',
      tran: '' //必须要
    }
    const vocaGroupDao = this.props.vocaGroupDao?this.props.vocaGroupDao:this.vocaGroupDao
    if(vocaGroupDao.addWordToDefault(groupWord)){
      this.setState({added:true})
    }
  }

  _removeWord = ()=>{
    const {word} = this.state.wordDict   
    const vocaGroupDao = this.props.vocaGroupDao?this.props.vocaGroupDao:this.vocaGroupDao
    if(vocaGroupDao.removeWordFromDefault(word)){
      this.setState({added:false})
    }
    
    
  }


  render() {
    const {word, properties} = this.state.wordDict
    return (
      <Container style={styles.container}>
        <Content>
          {/* 单词 */}
          <View style={[gstyles.r_between, styles.wordRow]}>
            <Text style={styles.word}>{word?word:''}</Text>
            <View style={gstyles.r_end}>
              <Text style={styles.errBtn}>报错</Text>
              {this.state.added && //从生词本移除
                <AliIcon name='pingfen' size={22} color='#F29F3F' 
                style={{marginRight:16}} 
                onPress={this._removeWord}/>
              }
              {!this.state.added && //添加到生词本
                <AliIcon name='malingshuxiangmuicon-' size={22} color='#888' 
                  style={{marginRight:16}} 
                  onPress={this._addWord}/>
              }
            </View>

            
          </View>
          {properties &&
            properties.map((propInfo , index)=>{
              return (
                // 词性
                <View key={index}  >
                  <Grid>
                    <Row  style={[gstyles.r_start,styles.property]}>
                      <Text style={[styles.iconText, {width:propInfo.property.length>1?30:20 }]}>{`${propInfo.property}.`}</Text>
                      <View style={[gstyles.r_start, ]}>
                          <View style={[gstyles.r_start,]}>
                              <Text style={styles.phonetic}>{propInfo.enPhonetic}</Text>
                              <FontAwesome5 name='headphones-alt' color='#E59AAA' size={20} onPress={()=>{
                                  playSound(propInfo.enPronUrl)
                              }}/>
                          </View>
                          <View style={[{marginLeft:20}, gstyles.r_start]}>
                            <Text style={styles.phonetic}>{propInfo.amPhonetic}</Text>
                            <FontAwesome5 name='headphones-alt' color='#3F51B5' size={20} onPress={()=>{
                                playSound(propInfo.amPronUrl)
                            }}/>
                          </View>
                      </View>
                    </Row>
                  </Grid>
                  {propInfo.defs &&
                    propInfo.defs.map((defInfo, index)=>{
                      return (
                        //释义例句卡片
                        <DictCard key={index} defInfo={defInfo} order={index+1}/>
                      )
                    })
                  }
                </View>
              )
            })
          }
          
            
          
          <View style={{width:'100%', height:16, backgroundColor:'#F0F0F0'}}></View>
        </Content>
      </Container>
    );
  }


}