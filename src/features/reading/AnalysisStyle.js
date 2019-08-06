
import {StyleSheet, Platform, StatusBar} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const WEBVIEW_HEIGHT = Platform.OS === "ios" ? height-55 : height-StatusBar.currentHeight-55 

const styles = StyleSheet.create({
    constainer:{
        flex:1,
    },  
    contents:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        flexWrap:'wrap'
    },
    webContainer:{
        width:width,
        height: WEBVIEW_HEIGHT,

    }
});


export default styles;