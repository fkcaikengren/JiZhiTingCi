import React, { Component } from 'react';
import {TouchableOpacity, FlatList, View, Text, StyleSheet} from 'react-native';
import { Container, Header, Input,Button, Icon, Content, Item } from 'native-base';

const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

const TestData = [
  {word:'abandon', phonetic:'/xx/', tran:'v. 抛弃；放弃；n. 放纵'},
  {word:'reserve', phonetic:'/xx/', tran:'n. 储备；保留；保护区；v. 保留；预定'}
]


const styles = StyleSheet.create({
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
  }
});


export default class VocaSearchPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchText: '',
    }
  }
  
  
  _renderItem = ({item})=>{
    return <TouchableOpacity key={item.word} onPress={()=>{alert('单词');}}>
      <View  style={{
        width:width,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-start',
      }}>
          <View>
              <Text>{item.word}</Text>
              <Text>{item.phonetic}</Text>
          </View>
          <Text>{item.tran}</Text>
      </View>
    </TouchableOpacity>
    

  }
  

  _search = ()=>{
    alert(this.state.searchText);
  }

  _clearSear = ()=>{
    this.setState({
      searchText:'',
    });
  }
  render() {

    return (
      <Container>
        

        <Header searchBar rounded style={{backgroundColor:'#1890FF'}}>
                    <Item style={styles.item1}>
                          <Icon name="ios-search" />
                          <Input placeholder="请输入要查询的单词或中文" value={this.state.searchText}  onChangeText={(text) => this.setState({searchText:text})} onSubmitEditing={()=>this._search()}/>
                          <Icon name="ios-close-circle" style={{fontSize:18}} onPress={()=>{this._clearSear()}}/>
                    </Item>
                    <Item  style={[styles.c_center,styles.item2]}>
                        <Text style={{fontSize:16, color:'#FFF'}} onPress={()=>{
                          this.props.navigation.goBack()
                          }}>取消</Text>
                    </Item>
                    </Header>
        <Content>
          <FlatList
              //数据源(数组)
              data={TestData}
              //渲染列表数据
              renderItem={this._renderItem}
              //分割线
              ItemSeparatorComponent={()=><View style={{borderBottomWidth:1,borderBottomColor:'#A8A8A8'}}></View>}
              
          />
        </Content>
      </Container>
    );
  }
}