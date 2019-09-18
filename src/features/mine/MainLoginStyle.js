import {StyleSheet} from 'react-native'
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
      flex:1,
      flexDirection:'column',
      justifyContent:'flex-start',
      alignItems:'center',
      backgroundColor: "#FFE957"
    },
    logoView:{
        flex:1,
        width:'100%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    loginView:{
        flex:1,
        width:'100%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    loginBtn:{
        width:'76%',
        height:45,
        borderRadius:100,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:20,
    },
    loginText:{
        color:'#FFF',
        fontSize:16,
        marginLeft:10,
    },
    otherLoginBtn:{
        marginTop:10,
    },
    otherLoginText:{
        color:'#FFF',
        fontSize:16,
        textDecorationLine:'underline'
    }
})

export default styles