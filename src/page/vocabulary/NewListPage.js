import React from "react";
import { FlatList , View, Text} from "react-native";
import { ListItem, Left, Body, Icon, Right, Title } from "native-base";

import AliIcon from '../../component/AliIcon';

export default class NewListPage extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        { name: "Movies", header: true },
        { name: "Interstellar", header: false },
        { name: "Dark Knight", header: false },
        { name: "Pop", header: false },
        { name: "Pulp Fiction", header: false },
        { name: "Burning Train", header: false },
        { name: "Music", header: true },
        { name: "Adams", header: false },
        { name: "Nirvana", header: false },
        { name: "Amrit Maan", header: false },
        { name: "Oye Hoye", header: false },
        { name: "Eminem", header: false },
        { name: "Places", header: true },
        { name: "Jordan", header: false },
        { name: "Punjab", header: false },
        { name: "Ludhiana", header: false },
        { name: "Jamshedpur", header: false },
        { name: "India", header: false },
        { name: "People", header: true },
        { name: "Jazzy", header: false },
        { name: "Appie", header: false },
        { name: "Baby", header: false },
        { name: "Sunil", header: false },
        { name: "Arrow", header: false },
        { name: "Things", header: true },
        { name: "table", header: false },
        { name: "chair", header: false },
        { name: "fan", header: false },
        { name: "cup", header: false },
        { name: "cube", header: false }
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
    if (item.header) {          //分类头
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
            <Text style={{ color:'#101010', fontSize:14}}>List 2</Text>
        </View>
      );
    } else if (!item.header) {          //单词
      return (
        <ListItem style={{marginLeft:0, paddingLeft:10,}}>
          <Body>
            <Text style={{ color:'#404040', fontSize:16, fontWeight:'500'}}>{item.name}</Text>
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