import {StyleSheet} from 'react-native'

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
        backgroundColor:'#FDFDFD',
        width:'100%',
        elevation:0,
    
    }
    
});
export default styles
