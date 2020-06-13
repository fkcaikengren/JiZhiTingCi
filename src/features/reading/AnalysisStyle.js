
import { StyleSheet, Platform, StatusBar } from 'react-native'
const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');
const WEBVIEW_HEIGHT = Platform.OS === "ios" ? height - 55 : height - StatusBar.currentHeight - 55

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contents: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    webContainer: {
        width: width,
        height: WEBVIEW_HEIGHT,

    },
    bottomBar: {
        width: width,
        height: 45,
        backgroundColor: '#FFE957',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    bottomBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    seperator: {
        width: 1,
        height: 40,
        backgroundColor: '#303030'
    },
    showAnswerBtn: {
        backgroundColor: '#FFE957',
        lineHeight: 26,
        paddingHorizontal: 2,
        borderRadius: 3,
        color: '#303030',
        marginRight: 8,
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
    floatBtn: {
        position: 'absolute',
        bottom: height / 2 - 50,
        left: 1,
        width: 35,
        height: 60,
        backgroundColor: '#FFE957CC',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatText: {
        fontSize: 14,
        fontWeight: '300',
        color: '#303030',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});


export default styles;