import {StatusBar, StyleSheet} from 'react-native'
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9'
    },
    statusBar:{
        width:'100%',
        height:STATUSBAR_HEIGHT,
        backgroundColor:'#FFE957'
    },
});

export default styles