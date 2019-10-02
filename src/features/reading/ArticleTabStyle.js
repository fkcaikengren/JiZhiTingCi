import {StyleSheet, Platform, StatusBar} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const WEBVIEW_HEIGHT = Platform.OS === "ios" ? height-55 : height-StatusBar.currentHeight-55 


const styles = StyleSheet.create({


    handinBtn:{
        backgroundColor:'#FFE957',
        lineHeight:26,
        paddingHorizontal:4,
        borderRadius:3,
        color:'#303030',
        marginRight:20,
    },
    menuOptions:{
    },

    menuOptionView:{
        width:120,
        height:40,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginHorizontal:10,
        borderBottomWidth:StyleSheet.hairlineWidth
    },
    menuOptionText:{
        fontSize:16,
        color:'#505050'
    },

    settingModal:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:width,
        height:200,
        backgroundColor: "#FFF"
    },
    settingPanel:{
        width:'100%',
    },

    settingLabel:{
        marginHorizontal:10,
    },  
    colorRadioView:{
        width:width,
        height:60,
    },
    fontRemView:{
        width:width,
        height:60,
    },



    floatBtn:{
        position:'absolute',
        bottom:260,
        right:1,
        width:35,
        height:60,
        backgroundColor:'#FFE957CC',
        borderTopLeftRadius:5,
        borderBottomLeftRadius:5,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    floatText:{
        fontSize:14,
        fontWeight:'300',
        color:'#303030',
        textAlign:'center',
        textAlignVertical:'center',
    },
})

export default styles;