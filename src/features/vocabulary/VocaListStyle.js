
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#FDFDFD',
        flex: 1
    },
    tabBar:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        height:40,
    },
    tabBtn:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    tabText:{
        color:'#303030',
        paddingHorizontal:4,
        paddingBottom:5,
    },
    headerView:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
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
        paddingLeft:10
    },
 
    itemRight:{
        flex:1,
    },
    checkBox:{
        margin:0,
        padding:0,
    },
    word:{ 
        color:'#303030', 
        fontSize:16,
    },

    iconStyle:{
        width:20,
        height:20,
        marginRight: 20,
    }
});

export default styles