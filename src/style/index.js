import { StyleSheet, StatusBar } from 'react-native'
const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');
const StatusBarHeight = StatusBar.currentHeight;

const gstyles = StyleSheet.create({
    //布局
    r_center: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    r_start: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    r_start_top: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    r_start_bottom: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    r_end: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    r_between: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    r_between_top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    r_between_bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    r_around: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    c_center: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    c_center_left: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    c_center_between: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    c_start: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    c_start_left: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    c_start_right: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    c_end: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    c_end_left: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    c_end_right: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },

    c_between: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    c_between_left: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    c_between_right: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },

    // 菜单栏
    menuOptionView: {
        width: 120,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 10,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    menuOptionText: {
        fontSize: 16,
        color: '#303030'
    },

    noteText: {
        fontSize: 12,
        lineHeight: 24,
        marginLeft: 3,
    },
    labelText: {
        textAlign: 'center',
        paddingTop: 2,
        lineHeight: 8,
        paddingHorizontal: 2,
        fontSize: 8,
        color: '#202020',
        backgroundColor: '#FFE957',
        borderRadius: 3,
    },


    haireBottom: {
        borderColor: '#F4F4F4',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },

    //Modal
    modal: {
        width: width,
        height: height - StatusBarHeight - 100,
        backgroundColor: "#FDFDFD",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    vocaModalView: {
        flex: 1,
        width: '100%',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingTop: 5
    },
    // 底部
    footer: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        width: '60%',
        height: 40,
        backgroundColor: '#FDFDFD',
    },
    serialText: {
        fontSize: 16,
        color: '#404040'
    },
    separator: {
        borderColor: '#F4F4F4',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    scrollView: {
        width: '100%',
        backgroundColor: '#F9F9F9'
    },
    scrollViewContent: {
        backgroundColor: '#F9F9F9',
    },

    loadingView: {
        flex: 1,
        height: height,
        width: width,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#FDFDFD'
    },
    closeBtn: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF',//'#FFE957',
        borderRadius: 50,
        elevation: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center'
    },

    // 导航栏样式
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#FFE957'
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        paddingHorizontal: 4,
        paddingBottom: 4,
    },
    // 通知消息
    msgDot: {
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: 'red',
        position: 'absolute',
        top: 1,
        right: 1,
        zIndex: 100
    },

    //灰色
    xs_lightGray: {
        color: '#AAA',
        fontSize: 12
    },
    sm_lightGray: {
        color: '#AAA',
        fontSize: 14
    },
    md_lightGray: {
        color: '#AAA',
        fontSize: 16
    },
    lg_lightGray: {
        color: '#AAA',
        fontSize: 18
    },
    xl_lightGray: {
        color: '#AAA',
        fontSize: 20
    },

    //浅灰色
    xs_gray: {
        color: '#909090',
        fontSize: 12
    },
    sm_gray: {
        color: '#909090',
        fontSize: 14
    },
    md_gray: {
        color: '#909090',
        fontSize: 16
    },
    lg_gray: {
        color: '#909090',
        fontSize: 18
    },
    xl_gray: {
        color: '#909090',
        fontSize: 20
    },


    //浅黑色
    xs_lightBlack: {
        color: '#505050',
        fontSize: 12
    },
    sm_lightBlack: {
        color: '#505050',
        fontSize: 14
    },
    md_lightBlack: {
        color: '#505050',
        fontSize: 16
    },
    lg_lightBlack: {
        color: '#505050',
        fontSize: 18
    },
    xl_lightBlack: {
        color: '#505050',
        fontSize: 20
    },

    //黑色
    xs_black: {
        color: '#202020',
        fontSize: 12
    },
    sm_black: {
        color: '#202020',
        fontSize: 14
    },
    md_black: {
        color: '#202020',
        fontSize: 16
    },
    lg_black: {
        color: '#202020',
        fontSize: 18
    },
    xl_black: {
        color: '#202020',
        fontSize: 20
    },
    // 黑色加粗
    xs_black_bold: {
        color: '#202020',
        fontSize: 12,
        fontWeight: '500'
    },
    sm_black_bold: {
        color: '#202020',
        fontSize: 14,
        fontWeight: '500'
    },
    md_black_bold: {
        color: '#202020',
        fontSize: 16,
        fontWeight: '500'
    },
    lg_black_bold: {
        color: '#202020',
        fontSize: 18,
        fontWeight: '500'
    },
    xl_black_bold: {
        color: '#202020',
        fontSize: 20,
        fontWeight: '500'
    },

    //白色
    xs_white: {
        color: '#FFF',
        fontSize: 12
    },
    sm_white: {
        color: '#FFF',
        fontSize: 14
    },
    md_white: {
        color: '#FFF',
        fontSize: 16
    },
    lg_white: {
        color: '#FFF',
        fontSize: 18
    },
    xl_white: {
        color: '#FFF',
        fontSize: 20
    },
    //白色加粗
    xs_white_bold: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '500'
    },
    sm_white_bold: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '500'
    },
    md_white_bold: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500'
    },
    lg_white_bold: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '500'
    },
    xl_white_bold: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '500'
    },

});


/** 颜色  */
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

/** 高度*/
gstyles.smHeight = 45
gstyles.mdHeight = 50
gstyles.lgHeight = 55

export default gstyles