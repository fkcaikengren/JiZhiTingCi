
import {StyleSheet} from 'react-native';
import gstyles from "../../style";

const styles = StyleSheet.create({
    content:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        flexWrap:'wrap',
    },
    selectedBottom:{
        width:'100%',
        height:30,
        position:'absolute',
        bottom:0,
        borderBottomRightRadius:5,
        borderBottomLeftRadius:5,
        backgroundColor:gstyles.mainColor+'AA',
    }
})

export default styles