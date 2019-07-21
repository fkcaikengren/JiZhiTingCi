import {StyleSheet, StatusBar} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const ITEM_H = 55;

const styles = StyleSheet.create({
  
    container:{
        width:width,
        height:height-240-STATUSBAR_HEIGHT,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },

    video:{
        width:width,
        height:260,
    },
    circle:{
        justifyContent:'center',
        alignItems:'center',
    
        width: 26,
        height:26,
        borderColor:'blue',
        borderWidth:1,
        borderRadius:20,
    },

    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    buttonText:{
        color:'#FFF',  
        padding:2,
        fontSize:14,
        textAlign:'center', 
        lineHeight:22, 
    },
    selectedButton:{
        borderColor:'#E59AAA',
        borderWidth:1,
        backgroundColor:'#E59AAA',
        height:22,
        elevation:0,
    },
    unSelectedButton:{
        borderColor:'#FFFFFF',
        borderWidth:1,
        backgroundColor:'#FFFFFF00',
        height:22,
        elevation:0,
    },
    outlineButton:{
        borderColor:'#fff',
        height:22,
        elevation:0
    },
    


    //列表样式
    item: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:width,
        height: ITEM_H,
        backgroundColor:'#FFFFFF00'
    },

    itemText:{
        color:'#FFFFFFAA',
    },

    triggerText:{
        color:'#FFF',  
        paddingHorizontal:3,
        fontSize:14,
        textAlign:'center', 
        lineHeight:20, 
        borderWidth:1,
        borderColor:'#FFF',
        borderRadius:1
    },
    intervalButton: {
        width:26,
        color:'#FFF',  
        paddingHorizontal:3,
        fontSize:14,
        textAlign:'center', 
        lineHeight:20, 
        borderWidth:1,
        borderColor:'#FFF',
        borderRadius:5
    },
    intervalFont:{
        fontSize:12,
    }

});

export default styles