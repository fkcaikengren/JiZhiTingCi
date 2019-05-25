import React, { Component } from 'react';
import {TouchableOpacity, FlatList, View, Text} from 'react-native';
import { Container, Header, Item, Input, Icon, Content } from 'native-base';

const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

const TestData = [
  {word:'abandon', phonetic:'/xx/', tran:'v. 抛弃；放弃；n. 放纵'},
  {word:'reserve', phonetic:'/xx/', tran:'n. 储备；保留；保护区；v. 保留；预定'}
]

export default class VocaSearchPage extends Component {
  
  
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
  
  render() {

    return (
      <Container>
        <Header searchBar rounded style={{backgroundColor:'#1890FF'}}>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="请输入要查词的单词" />
            <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}}>
              <Text style={{fontSize:16, color:'#1890FF', paddingRight:10}}>取消</Text>
            </TouchableOpacity>
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