import {StyleSheet} from 'react-native'
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
      flex:1,
      flexDirection:'column',
      justifyContent:'flex-start',
      alignItems:'center',
      backgroundColor: "#FDFDFD"
    },
    row:{
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',
    },
    phoneLogin:{
      marginTop:100,
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      width:width-100,
    },
    logo:{
      width:'100%',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      paddingBottom:50,
    },
    phone:{
      width:'100%',
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',
      borderBottomWidth:1,
    },
    otherLoginView:{
      position:'absolute',
      bottom:60,
    },
    line:{
      width:70,
      borderBottomWidth:1,
      height:1,
      borderColor:'#AAA'
    },
    otherLoginBtn:{
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      width:45,
      height:45,
      borderRadius:100,
      marginHorizontal:30,
    }
})

export default styles