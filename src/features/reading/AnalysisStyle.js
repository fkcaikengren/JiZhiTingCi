
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

    },
    bottomBar:{
        width:width,
        height:40,
        backgroundColor:'#FFE957',
        position:'absolute',
        bottom:0,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    barText:{
        width: '50%',
        color:'#FFF',
        fontSize:16,
        textAlign:'center'
    },
    seperator:{
        width:1,
        height:40,
        backgroundColor:'#FFF'
    }
});


export default styles;