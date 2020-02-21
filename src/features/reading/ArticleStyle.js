import { StyleSheet, Platform, StatusBar } from 'react-native'
const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');
const WEBVIEW_HEIGHT = Platform.OS === "ios" ? height - 55 : height - StatusBar.currentHeight - 55


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
    },

    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        //   borderWidth:StyleSheet.hairlineWidth
    },
    word: {
        fontSize: 16,
        color: '#303030'
        //   borderWidth:StyleSheet.hairlineWidth,
    },
    clickQuestionBtnWrapper: {
        fontSize: 14,
        color: '#303030',
        paddingHorizontal: 2,
        paddingBottom: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#606060'
    },
    clickQuestionBtn: {
        color: '#606060',
    },

    answerModal: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: width,
        height: 190,
        backgroundColor: "#AAA"
    },
    answerPanel: {
        flexWrap: 'wrap',
        width: '100%',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#FFF'
    },
    modalAnswerOption: {
        fontSize: 16,
        color: '#303030',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        backgroundColor: '#FDFDFD',
        paddingHorizontal: 2,
        marginRight: 18,
        marginBottom: 10,
    },

    webContainer: {
        width: width,
        height: WEBVIEW_HEIGHT,

    },



});


export default styles;
