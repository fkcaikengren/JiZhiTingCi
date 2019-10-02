import {StyleSheet} from 'react-native'
import gstyles from "../../style";

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#EFEFEF',
    },
    mainView:{
        marginTop:16,
        borderTopColor:'#DFDFDF',
        borderTopWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#DFDFDF',
        borderBottomWidth:StyleSheet.hairlineWidth,

    },


    itemWrapper:{
        paddingLeft:12,
        backgroundColor:'#FDFDFD'
    },
    itemView:{
        height:60,
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#DFDFDF',
        paddingLeft: 10,
    },
    logout:{
        height:50,
        marginTop:10,
        backgroundColor:'#FDFDFD',
        borderTopColor:'#DFDFDF',
        borderTopWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#DFDFDF',
        borderBottomWidth:StyleSheet.hairlineWidth,

    },
    imgStyle:{
        width:40,
        height:40,
        borderRadius:50,
    },
    clearBtn:{
        color:'red',
        position:'absolute',
        bottom:20,
    }


});

export default styles