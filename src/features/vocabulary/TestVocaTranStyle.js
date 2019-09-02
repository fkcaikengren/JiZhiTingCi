import {StyleSheet,StatusBar} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FEFEFE',
    },
    content:{
        padding:10,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        height:'35%'
    },
    phoneticView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    wordFont:{
        fontSize:30,
        color:'#202020',
        fontWeight:'600'
    },
    btnFont:{
        width:'90%',
        fontSize:16,
        color:'#202020',
        textAlign:'left'
    },
    selectBtn:{
        backgroundColor:'#EFEFEF',
        borderRadius:8,
    },
    modal: {
        width:width,
        height: height-StatusBarHeight-80,
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
        width:'100%',
        height:60,
        flex:1,
        paddingHorizontal:10,
    }
   
    
});
export default styles