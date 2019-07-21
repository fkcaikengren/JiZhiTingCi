import {StyleSheet,StatusBar} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#F0F0F0',
    },
    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    row:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    col:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    tipRow:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    enFont:{
        fontSize:18,
        color:'#303030'
    },
    btnFont:{
        fontSize:16,
        color:'#303030',
        fontWeight:'500'
    },
    selectBtn:{
        borderWidth:1,
        borderColor:'#FDFDFD',
        backgroundColor:'#FDFDFD',
        width:'100%',
        elevation:0,
    
    },
    modal: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
      },

    modal2: {
        width:width,
        height: height-StatusBarHeight,
        backgroundColor: "#FDFDFD"
    },
    modalBtn:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#A0A0A0',
        borderRadius:2,
        
    },
    modalBottom:{
        position:'absolute', 
        bottom:0, 
        width:width,
        height:50,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        backgroundColor:'#EFEFEF'
    }
   
    
});
export default styles