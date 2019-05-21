import React from "react";
import { FlatList , View, Text, StyleSheet, Image} from "react-native";
import { ListItem, Left, Body, Icon, Right, Title } from "native-base";
import CheckBox from 'react-native-check-box'

import AliIcon from '../component/AliIcon';
import {selectedImg , circleImg} from '../image';

const styles = StyleSheet.create({
  iconStyle:{
    width:20,
    height:20,
    marginRight: 20,
  }
});

export default class WrongListPage extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        { name: "Movies", header: true, checked:false },
        { name: "Interstellar", header: false, checked:false },
        { name: "Dark Knight", header: false, checked:true },
        { name: "Pop", header: false, checked:true },
        { name: "Pulp Fiction", header: false, checked:false },
        { name: "Burning Train", header: false, checked:false },
        { name: "Music", header: true, checked:false },
        { name: "Adams", header: false, checked:false },
        { name: "Nirvana", header: false, checked:false },
        { name: "Amrit Maan", header: false, checked:false },
        { name: "Oye Hoye", header: false, checked:false },
        { name: "Eminem", header: false, checked:true },
        { name: "Places", header: true, checked:false },
        { name: "Jordan", header: false, checked:true },
        { name: "Punjab", header: false, checked:true },
        { name: "Ludhiana", header: false, checked:false },
        { name: "Jamshedpur", header: false, checked:false },
        { name: "India", header: false, checked:false },
        { name: "People", header: true, checked:false },
        { name: "Jazzy", header: false, checked:false },
        { name: "Appie", header: false, checked:false },
        { name: "Baby", header: false, checked:false },
        { name: "Sunil", header: false, checked:false },
        { name: "Arrow", header: false, checked:false },
        { name: "Things", header: true, checked:false },
        { name: "table", header: false, checked:false },
        { name: "chair", header: false, checked:false },
        { name: "fan", header: false, checked:false },
        { name: "cup", header: false, checked:false },
        { name: "cube", header: false, checked:false }
      ],
      stickyHeaderIndices: []
    };
  }
  componentWillMount() {
    var arr = [];
    this.state.data.map(obj => {
      if (obj.header) {
        arr.push(this.state.data.indexOf(obj));
      }
    });
    arr.push(0);
    this.setState({
      stickyHeaderIndices: arr
    });
  }
  renderItem = ({ item }) => {
    if (item.header) {
      return (
        <View style={{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        paddingVertical:4,
        paddingLeft:10,
        backgroundColor:'#C0E5FF'
        }}
        >
          <Text style={{ color:'#101010', fontSize:14}}>答错5次，共12词</Text>
        </View>
      );
    } else if (!item.header) {
      return (
        <ListItem style={{marginLeft:0, paddingLeft:10,}}>
          <Body style={{flexDirection:'row'}}>
            <CheckBox
              style={{ backgroundColor:'#FFF'}}
              onClick={()=>{
                alert('hello');
              }}
              isChecked={item.checked}
              checkedImage={<Image source={selectedImg} style={styles.iconStyle}/>}
              unCheckedImage={<Image source={circleImg} style={styles.iconStyle}/>}
              />
            <Text style={{ color:'#2D4150', fontSize:16, fontWeight:'500'}}>{item.name}</Text>
          </Body>
          <Right>
              <AliIcon name='youjiantou' size={26} color='#C9C9C9'></AliIcon>
          </Right>
        </ListItem>
      );
    }
  };
  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={item => item.name}
        stickyHeaderIndices={this.state.stickyHeaderIndices}
      />
    );
  }
}