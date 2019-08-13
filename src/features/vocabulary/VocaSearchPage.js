import React, { Component } from 'react';
import {StatusBar ,FlatList, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';

import VocaDao from './service/VocaDao'
import VocaGroupDao from './service/VocaGroupDao'
import DetailDictPage from './component/DetailDictPage';
import styles from './VocaSearchStyle'
import gstyles from '../../style'
import AliIcon from '../../component/AliIcon'

const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;



export default class VocaSearchPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchText: '',
      data:[],
      searchWord: '',
      tran:'',
      showClearBtn:false,
    }
    this.vocaDao = new VocaDao();
    this.vocaGroupDao = new VocaGroupDao()

    console.disableYellowBox = true;
  }

  componentDidMount(){
    this.vocaDao.open()
    this.vocaGroupDao.open()
  }


  componentWillUnmount(){
    this.vocaDao.close()
    this.vocaGroupDao.close()
  }


  _keyExtractor = (item, index) => item.word;
  
  
  _renderItem = ({item})=>{
    return <TouchableOpacity  onPress={()=>{
      this.setState({searchWord:item.word, tran:item.trans})
    }}>
      <View  style={styles.item}>
          <View style={gstyles.r_start}>
              <Text style={[styles.contentText,{fontSize:16,color:'#404040'}]}>{item.word}</Text>
              <Text style={[styles.contentText,{fontSize:12,color:'#999999'}]}>{item.enPhonetic}</Text>
          </View>
          <Text numberOfLines={1} style={[styles.contentText,{fontSize:12,color:'#606060'}]}>{item.trans}</Text>
      </View>
    </TouchableOpacity>
    

  }
  


  _changeText = (searchText)=>{
    const data = this.vocaDao.searchWord(searchText)
    const showClearBtn = searchText.length>0?true:false
    this.setState({searchText, data, showClearBtn})

  }

  _clear = ()=>{
    this.setState({
      searchText:'',
      searchWord:''
    });
    this._inputRef.focus()
  }


  _onFocus = (e)=>{
    if(this.state.searchWord !== ''){
      this.setState({searchWord:''})
    }
  }

  

  render() {

    return (
        <View style={{flex: 1}}>
          <StatusBar translucent={true} />
          <View style={{width:width, height:StatusBarHeight, backgroundColor:'#EFEFEF'}}></View>
          {/* 搜索栏 */}
          <View style={[gstyles.r_around, styles.searchBar]}>
            <View style={[gstyles.r_between, styles.inputWrapper]}>
              <View style={gstyles.r_start}>
                {/* 查找图标 */}
                <AliIcon name='chazhao1' size={20} color='#666' style={styles.searchIcon}/>
                {/* 搜索框 */}
                <TextInput
                  ref={ref=>this._inputRef = ref}
                  style={{height:40,width:'80%'}}
                  value={this.state.searchText}
                  placeholder="请输入英文单词"
                  onChangeText={this._changeText}
                  clearButtonMode='while-editing'
                  onFocus={this._onFocus}
                  autoFocus
                />
              </View>
              {/* 清空图标 */}
              {this.state.showClearBtn &&
                <AliIcon name='guanbi' size={16} color='#666' style={styles.clearIcon} 
                  onPress={this._clear}/>
              }
            </View>
            <TouchableWithoutFeedback onPress={()=>{this.props.navigation.goBack()}}>
              <Text style={styles.cancelBtn}>取消</Text>
            </TouchableWithoutFeedback>
          
          </View>
          {/* 搜索结果列表 */}
          {this.state.searchWord === ''&&
            <FlatList
                ref= {ref=>this._listRef = ref}
                data={this.state.data}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
            />
          }

          {this.state.searchWord !== ''&&
            <DetailDictPage 
            vocaDao={this.vocaDao}
            vocaGroupDao={this.vocaGroupDao}
            word={this.state.searchWord} 
            tran={this.state.tran}/>
          }
       
      </View>
    );
  }
}