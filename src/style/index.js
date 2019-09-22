import {StyleSheet, StatusBar} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const StatusBarHeight = StatusBar.currentHeight;

const gstyles = StyleSheet.create({
    //布局
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
    c_center_start:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-start',
    },
    c_center_between:{
        flexDirection:'column',
        justifyContent:'space-between',
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
    //Modal
    modal: {
        width:width,
        height: height-StatusBarHeight-80,
        backgroundColor: "#FDFDFD"
    },
    modalBottom:{
        position:'absolute', 
        bottom:0, 
        width:'100%',
        height:60,
        flex:1,
        paddingHorizontal:10,
    },
    footer: {
        position:'absolute',
        bottom:10,
        alignSelf:'center',
        width:'60%',
        height:40,
        backgroundColor: '#FDFDFD',
       
    },
    serialText: {
        fontSize: 16,
        color:'#404040'
    },

    errBtn:{
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:'#888',
        borderRadius:3,
        fontSize:12,
        color:'#888',
        paddingHorizontal:2,
        textAlign:'center',
        marginRight:16,
    },
    //灰色
    xs_lightGray:{
        color: '#AAA',
        fontSize: 12
    },
    sm_lightGray:{
        color: '#AAA',
        fontSize: 14
    },
    md_lightGray:{
        color: '#AAA',
        fontSize: 16
    },
    lg_lightGray:{
        color: '#AAA',
        fontSize: 18
    },
    xl_lightGray:{
        color: '#AAA',
        fontSize: 20
    },

    //浅灰色
    xs_gray:{
        color: '#909090',
        fontSize: 12
    },
    sm_gray:{
        color: '#909090',
        fontSize: 14
    },
    md_gray:{
        color: '#909090',
        fontSize: 16
    },
    lg_gray:{
        color: '#909090',
        fontSize: 18
    },
    xl_gray:{
        color: '#909090',
        fontSize: 20
    },


    //浅黑色
    xs_lightBlack:{
        color: '#303030',
        fontSize: 12
    },
    sm_lightBlack:{
        color: '#303030',
        fontSize: 14
    },
    md_lightBlack:{
        color: '#303030',
        fontSize: 16
    },
    lg_lightBlack:{
        color: '#303030',
        fontSize: 18
    },
    xl_lightBlack:{
        color: '#303030',
        fontSize: 20
    },

    //黑色
    xs_black:{
        color: '#202020',
        fontSize: 12
    },
    sm_black:{
        color: '#202020',
        fontSize: 14
    },
    md_black:{
        color: '#202020',
        fontSize: 16
    },
    lg_black:{
        color: '#202020',
        fontSize: 18
    },
    xl_black:{
        color: '#202020',
        fontSize: 20
    },
    // 黑色加粗
    xs_black_bold:{
        color: '#202020',
        fontSize: 12,
        fontWeight:'500'
    },
    sm_black_bold:{
        color: '#202020',
        fontSize: 14,
        fontWeight:'500'
    },
    md_black_bold:{
        color: '#202020',
        fontSize: 16,
        fontWeight:'500'
    },
    lg_black_bold:{
        color: '#202020',
        fontSize: 18,
        fontWeight:'500'
    },
    xl_black_bold:{
        color: '#202020',
        fontSize: 20,
        fontWeight:'500'
    },

    //白色
    xs_white:{
        color: '#FFF',
        fontSize: 12
    },
    sm_white:{
        color: '#FFF',
        fontSize: 14
    },
    md_white:{
        color: '#FFF',
        fontSize: 16
    },
    lg_white:{
        color: '#FFF',
        fontSize: 18
    },
    xl_white:{
        color: '#FFF',
        fontSize: 20
    },
    //白色加粗
    xs_white_bold:{
        color: '#FFF',
        fontSize: 12,
        fontWeight:'500'
    },
    sm_white_bold:{
        color: '#FFF',
        fontSize: 14,
        fontWeight:'500'
    },
    md_white_bold:{
        color: '#FFF',
        fontSize: 16,
        fontWeight:'500'
    },
    lg_white_bold:{
        color: '#FFF',
        fontSize: 18,
        fontWeight:'500'
    },
    xl_white_bold:{
        color: '#FFF',
        fontSize: 20,
        fontWeight:'500'
    },

});


//** 颜色  */
gstyles.mainColor = '#FFE957'
gstyles.secColor = '#F29F3F'
gstyles.emColor = '#F2753F'
gstyles.infoColor = '#1890FF'
gstyles.bgLightGray = '#FDFDFD'
gstyles.bgGray = '#EFEFEF'
gstyles.lightBlack = '#303030'
gstyles.black = '#202020'
gstyles.gray = '#909090'
gstyles.lightGray = '#AAA'

export default gstyles