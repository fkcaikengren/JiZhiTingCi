import {StyleSheet} from 'react-native'
import gstyles from "../../style";
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

    phoneLoginView:{
        flex:6,
        marginTop:100,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:width-60,
    },
    logo:{
      width:'100%',
      paddingBottom:50,
    },
    phoneInput:{
        width: '100%',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: gstyles.gray,
        borderRadius: 100,
        height:50,
        paddingLeft:20,
    },
    otherLoginView:{
        flex:4,
        width:width-60,
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