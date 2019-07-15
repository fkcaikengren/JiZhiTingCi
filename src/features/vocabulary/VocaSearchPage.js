import React, { Component } from 'react';
import {TouchableOpacity, TextInput,StatusBar ,FlatList, View, Text, StyleSheet} from 'react-native';
import { Container, Header, Input,Button, Icon, Content, Item } from 'native-base';


import VocaDao from './dao/VocaDao'
import VocaGroupDao from './dao/VocaGroupDao'
import DetailDictPage from './component/DetailDictPage';
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const TestData = [
  {word:'abandon', phonetic:'/xx/', tran:'v. 抛弃；放弃；n. 放纵'},
  {word:'reserve', phonetic:'/xx/', tran:'n. 储备；保留；保护区；v. 保留；预定'}
]


const styles = StyleSheet.create({
  row:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },  
  item:{
    width:width,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'flex-start',
    padding:8,
    borderBottomWidth:1,
    borderColor:'#EFEFEF'
    
  },
  item1: {
    flexBasis:6, 
    flexGrow:6, 
    flexShrink:6, 
  },
  item2: {
    flexBasis:1, 
    flexGrow:1, 
    flexShrink:1, 
    backgroundColor:'#1890FF'
  },
  c_center: {
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  },
  contentText:{
    paddingLeft:5
  },

});


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
      <Container>
        <StatusBar
              translucent={true}
              // hidden
          />
          <View style={{width:width, height:STATUSBAR_HEIGHT, backgroundColor:'#FDFDFD'}}></View>
          {/* 头部 */}
        <Header searchBar rounded style={{backgroundColor:'#1890FF'}}>
                    <Item style={styles.item1}>
                          <Icon name="ios-search" />
                          <Input autoFocus
                          ref={ref=>this._inputRef = ref}
                          maxLength={50}
                          placeholder="请输入要查询的单词或中文"
                          value={this.state.searchText}
                          onChangeText={this._changeText} 
                          onFocus={this._onFocus}/>
                          <Icon name="ios-close-circle" style={{fontSize:18}} onPress={()=>{this._clearSear()}}/>
                    </Item>
                    <Item  style={[styles.c_center,styles.item2]}>
                        <Text style={{fontSize:16, color:'#FFF'}} onPress={()=>{
                          this.props.navigation.goBack()
                          }}>取消</Text>
                    </Item>
                    </Header>

                    
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
        

       
      </Container>
    );
  }
}