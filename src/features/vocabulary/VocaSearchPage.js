import React, { Component } from 'react';
import {TouchableOpacity,StatusBar ,FlatList, View, Text, StyleSheet} from 'react-native';
import {SearchBar } from 'react-native-elements'

import VocaDao from './dao/VocaDao'
import VocaGroupDao from './dao/VocaGroupDao'
import DetailDictPage from './component/DetailDictPage';
import styles from './VocaSearchStyle'

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
    }
    this.vocaDao = new VocaDao();
    this.vocaGroupDao = new VocaGroupDao()
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
          <View style={styles.row}>
              <Text style={[styles.contentText,{fontSize:16,color:'#404040'}]}>{item.word}</Text>
              <Text style={[styles.contentText,{fontSize:12,color:'#999999'}]}>{item.enPhonetic}</Text>
          </View>
          <Text numberOfLines={1} style={[styles.contentText,{fontSize:12,color:'#606060'}]}>{item.trans}</Text>
      </View>
    </TouchableOpacity>
    

  }
  

  _search = ()=>{
    alert(this.state.searchText);
  }

  _changeText = (searchText)=>{
    const data = this.vocaDao.searchWord(searchText)
    this.setState({searchText, data})
  }

  _clearSear = ()=>{
    this.setState({
      searchText:'',
      searchWord:''
    });
    this._inputRef._root.focus()
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

        <SearchBar
          platform='ios'
          containerStyle={{height:55,backgroundColor:'#FFE957'}}
          inputContainerStyle={{backgroundColor:'#FDFDFD'}}
          cancelButtonProps={
            {color:'#303030'}
          }
          ref={ref=>this._inputRef = ref}
          placeholder="请输入英文单词"
          onChangeText={this._changeText}
          value={this.state.searchText}
          onCancel={()=>{
            this.props.navigation.goBack()
            }}
          />  
          {this.state.searchWord === ''&&
            <FlatList
                ref= {ref=>this._listRef = ref}
                //数据源(数组)
                data={this.state.data}
                //渲染列表数据
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