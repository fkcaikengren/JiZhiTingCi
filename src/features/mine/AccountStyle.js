import {StyleSheet} from 'react-native'

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
        height:50, 
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#DFDFDF', 
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

});

export default styles