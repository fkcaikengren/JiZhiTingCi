import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container:{
      flexDirection:'column',
      justifyContent:'center',
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
    }
})

export default styles