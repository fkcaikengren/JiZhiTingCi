
import {StyleSheet} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');


const styles = StyleSheet.create({
    searchBar:{
      height: 55, 
      width:width,
      backgroundColor:'#FFF'
    },
    searchIcon:{
      marginHorizontal:6,
    },
    clearIcon:{
      marginRight:5,
    },
    inputWrapper:{
      height: 36, 
      width:'80%',
      borderRadius:5,
      backgroundColor:'#EFEFEF'
    },  
    cancelBtn:{
      color:'#202020',
      fontSize:16,
      paddingRight:5,
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
    contentText:{
      paddingLeft:5
    },
  
  });
  export default styles