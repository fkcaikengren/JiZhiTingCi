import { StyleSheet, StatusBar } from 'react-native'
const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');
const ITEM_H = 55;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },

    video: {
        width: width,
        height: 260,
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',

        width: 26,
        height: 26,
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 20,
    },

    center: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    outlineButton: {
        borderColor: '#fff',
        height: 22,
        elevation: 0
    },



    //列表样式
    item: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: ITEM_H,
        backgroundColor: '#FFFFFF00'
    },

    itemEnText: {
        fontSize: 18,
        color: '#FFFFFFDD',
        textAlign: 'center'
    },
    itemZhText: {
        fontSize: 14,
        color: '#FFFFFFAA',
    },

    triggerText: {
        width: 40,
        color: '#FFF',
        paddingHorizontal: 4,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 24,
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 4
    },

    studyIntervalButton: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 24,
        borderColor: '#FFF',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 4,
    },

    //底部控制栏
    textIcon: {
        height: 26,
        width: 26,
        lineHeight: 24,
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 4,

    },
    unSelected: {
        color: '#FFF',
        borderColor: '#FFF',

    },
    smallRoundBtn: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 60,
    },
    bigRoundBtn: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 65,
        height: 65,
        borderRadius: 70,
    },

    bgImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        width: null,
        height: null,
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },




});

export default styles