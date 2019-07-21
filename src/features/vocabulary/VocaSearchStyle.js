
import {StyleSheet} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');


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
  export default styles