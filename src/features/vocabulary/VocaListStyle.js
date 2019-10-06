
import {StyleSheet} from 'react-native'

import gstyles from '../../style'

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#FDFDFD',
        flex: 1,
    },
    editBtn:{
        fontSize:14,
        color:'#303030',
        borderWidth:StyleSheet.hairlineWidth,
        padding:2,
        borderRadius:2,
        borderColor:'#555'
    },
    tabBar:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        height:40,
        backgroundColor:gstyles.mainColor
    },
    tabBtn:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    tabText:{
        paddingHorizontal:4,
        paddingBottom:4,
    },
    headerView:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        height:30,
        paddingVertical:4,
        paddingLeft:10,
        backgroundColor:'#EFEFEF'
    },
    headerText:{
         color:'#444', 
         fontSize:14
    },
    item:{
        height:45,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EFEFEF'
    },  
    itemLeft:{
        flex:3,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        overflow:'hidden'
    },
    itemCenter:{
        flex:4,
        paddingLeft:10,
        paddingVertical:10,
    },
 
    itemRight:{
        flex:1,
        paddingLeft:10,
    },
    checkBox:{
        margin:0,
        padding:0,
    },
    word:{ 
        color:'#303030', 
        fontSize:16,
    },

    bottomBtn:{
        position:'absolute', 
        alignSelf:'center', 
        width:'60%',
        height:40,
        bottom:10,
        // backgroundColor:'#FFE957',

    }
});

export default styles