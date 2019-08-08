import {StyleSheet, Platform, StatusBar} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const WEBVIEW_HEIGHT = Platform.OS === "ios" ? height-55 : height-StatusBar.currentHeight-55 


const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:width,
    },  
    headerBar:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:width,
        height:55,
    },
    scrollView:{
        height:height-50,
        width:width,
        paddingHorizontal:10,
    },  
    content:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-start',
        flexWrap:'wrap',
        //   borderWidth:StyleSheet.hairlineWidth
    },
    word:{
        fontSize:16,
        color:'#303030'
        //   borderWidth:StyleSheet.hairlineWidth,
    },
    clickQuestionBtnWrapper:{
        fontSize:14,
        color:'#303030',
        paddingHorizontal:2,
        paddingBottom:1,
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#606060'
    },
    clickQuestionBtn:{
        color:'#606060',
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

    answerModal:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
        width:width,
        height:190,
        backgroundColor: "#AAA"
    },
    answerPanel:{
        flexWrap:'wrap',
        width:'100%',
        padding:10,
        borderTopWidth:1,
        borderColor:'#FFF'
    },  
    modalAnswerOption:{
        fontSize:16,
        borderWidth:StyleSheet.hairlineWidth,
        borderRadius:6,
        backgroundColor:'#FDFDFD',
        paddingHorizontal:2,
        marginRight:18,
        marginBottom:10,
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
    webContainer:{
        width:width,
        height: WEBVIEW_HEIGHT,

    },
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

});


export default styles;
