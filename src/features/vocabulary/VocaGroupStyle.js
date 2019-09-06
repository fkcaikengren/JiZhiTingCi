import {StyleSheet} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#FDFDFD',
        flex: 1
    },
    content:{
        flex:1,
        paddingHorizontal:10,
    },
    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    row:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    col:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    groupItem:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#F0F0F0',
        borderRadius:4,
        marginTop:16, 
        paddingVertical:10
    },
    iconBg:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#1890FF',
        width:40,
        height:40,
        borderRadius:100,
        marginLeft:10,
    },
    modal: {
        width:width-100,
        height: 230,
        backgroundColor: "#EFEFEF"
    },
    buttongGroup:{
        width:width-100,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        marginTop:10
    },

    
    bottomBtnGroup:{
         flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
    }
   
});

export default styles