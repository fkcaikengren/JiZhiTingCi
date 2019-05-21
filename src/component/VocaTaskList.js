import React from "react";
import { FlatList, View , Text, StyleSheet} from "react-native";
import { ListItem,Container, Header, Left, Body, Right,
  Icon ,Button } from 'native-base';

import HomeMenu from './HomeMenu';

const styles = StyleSheet.create({
  listButton : {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    color:'#1890FF', 
    backgroundColor:'#1890FF22', 
    width:60, 
    elevation:0,
    borderWidth:0,

  },
});


class VocaTaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data:  [
            {type:'header', name:''},
            {type:'title', name:'今日新学'},
            {type:'newLearn', listID:4, isCompleted:true}, 
            {type:'newLearn', listID:5, isCompleted:false}, 
            {type:'newLearn', listID:6, isCompleted:false},
            {type:'title', name:'今日复习'},
            {type:'todayReview1', listID:4, isLocked:false, isCompleted:true}, 
            {type:'todayReview1', listID:5, isLocked:true, isCompleted:false}, 
            {type:'todayReview1', listID:6, isLocked:true, isCompleted:false},
            {type:'todayReview2', listID:4, isLocked:false, isCompleted:true}, 
            {type:'todayReview2', listID:5, isLocked:false, isCompleted:false}, 
            {type:'todayReview2', listID:6, isLocked:false, isCompleted:false},
            {type:'title', name:'往日回顾'},
            {type:'pastReview', listID:1, isCompleted:true}, 
            {type:'pastReview', listID:2, isCompleted:false}, 
            {type:'pastReview', listID:3, isCompleted:false}
        ],
        stickyHeaderIndices: [0, 1, 5, 12],
    };
  }
  
  _renderItem = ({ item, index }) => {
    let bodyStyle = {};
    let buttonContent = {color:'#1890FF', fontSize:14, fontWeight:'500'};
    let iconName = 'square-o';
    let iconStyle = {color:'#1890FF'};
    let buttonName = '开始';
    
    if(item.isCompleted==true){
        bodyStyle = {textDecorationLine:'line-through'}
        iconName = 'check-square';
        iconStyle = {color:'#1890FF'};
        buttonName = '已完成';
    }

    let note = '';
    switch(item.type){
        case 'newLearn':
            note = '约10min可完成'; break;
        case 'todayReview1':
            note = '建议3min后复习'; break;
        case 'todayReview2':
            note = '建议12h后复习'; break;
        case 'pastReview':
            note = '约12min可完成'; break;
        default:
            break;
    }
    if(item.type == 'header'){
      return (
        <HomeMenu {...this.props}/>  
      );
    }else if(item.type == 'title') {
      return (
        <View style={{backgroundColor:'#FDFDFD', paddingLeft:15, paddingVertical:15}}>
          <Text style={{ color:'#2D4150', fontSize:16, fontWeight:'500'}}>
            {item.name}
          </Text>
        </View>          
      
        
      );
    } else{
      return (
        <ListItem  thumbnail style={{ padding:0}}>
            <Left >
                <Icon type='FontAwesome' name={iconName} size={30} style={[iconStyle]}/>
            </Left>
            <Body >
                <Text style={[{ color:'#2D4150', fontSize:14, fontWeight:'500'}]}>学习List{item.listID}</Text>
                <Text note numberOfLines={1} >{note}</Text>
            </Body>
            <Right>
                <Button rounded style={styles.listButton} onPress={()=>{
                }}>
                    <Text style={[buttonContent]}>{buttonName}</Text>
                </Button>
            </Right>
        </ListItem>
      );
    }
  };
  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={(item, index) => index.toString()}
        stickyHeaderIndices={this.state.stickyHeaderIndices}
      />
    );
  }
}


export default VocaTaskList;

