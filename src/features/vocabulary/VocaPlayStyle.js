import {StyleSheet, StatusBar} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const ITEM_H = 55;

const styles = StyleSheet.create({
   
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    content:{
        width:'100%'
        // width:width-120,
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
        height: ITEM_H,
        backgroundColor:'#FFFFFF00'
    },

    itemEnText:{
        fontSize:16,
        color:'#FFFFFFAA',
    },
    itemZhText:{
        fontSize:12,
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
    
    //底部控制栏
    textIcon:{
        height:22,
        width:22,
        textAlign:'center',
        borderWidth:1,
        borderRadius:2,
        
    },
    unSelected:{
        color:'#FFF',
        borderColor:'#FFF',
        
    },
    smallRoundBtn:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:34,
        height:34,
        borderRadius:60,
    },
    bigRoundBtn:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:55,
        height:55,
        borderRadius:60,
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
    },
    //----------
    
    tasksModal:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
        width:'100%',
        height:360,
        backgroundColor: "#FDFDFD"
    },
    modalHeader: {
        width:width,
        height:40,
        position:'absolute',
        top:0,
        backgroundColor:'#EFEFEF'
    },
    taskItem:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:10,
        paddingVertical:8,
        borderColor: '#F4F4F4',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    nameView: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-start',
    },  
    nameText: {
        fontSize: 16,
        color:'#303030'
    },
    noteText: {
        fontSize:12,
        lineHeight: 16,
    },
    WrongAvgDot: {
        width:4,
        height:4,
        borderRadius:20
    },
    closeBtn:{
        position:'absolute',
        bottom: 14,
        right:14,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        padding:10,
    }

  
    
});

export default styles