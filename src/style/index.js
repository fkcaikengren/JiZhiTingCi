import {StyleSheet} from 'react-native'

const gstyles = StyleSheet.create({
    r_center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    r_start:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    r_start_top:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    r_end:{
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
    },
    r_between:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    r_around:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
    },
    c_center:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    c_start:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    c_end:{
        flexDirection:'column',
        justifyContent:'flex-end',
        alignItems:'center',
    },
    haireBottom:{
        borderColor: '#F4F4F4',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    pageTitle:{
        color:'#FFF', 
        fontSize:18
    }

});

export default gstyles