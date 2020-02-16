import { StatusBar, StyleSheet, Dimensions } from 'react-native'
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
let { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9'
    },
    statusBar: {
        width: '100%',
        height: STATUSBAR_HEIGHT,
        backgroundColor: '#FFE957'
    },
    finishView: {
        width: width,
        height: 200,
        backgroundColor: '#FFF',
        borderRadius: 12,
    },
    shareContent: {
        width: '80%',
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        paddingTop: 18,
        paddingBottom: 5,
        marginTop: 35
    },
    userAvatar: {
        width: '100%',
        position: 'absolute',
        top: -20,
        left: 0,
        marginBottom: 4
    }
});

export default styles