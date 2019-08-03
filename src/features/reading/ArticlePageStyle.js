import {StyleSheet} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    contentWrapper:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
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
        fontSize:16,
        color:'#303030',
        paddingHorizontal:2,
        paddingBottom:1,
        borderBottomWidth:1,
        borderBottomColor:'#606060'
    },
    clickQuestionBtn:{
        color:'#606060',
    },
    floatBtn:{
        position:'absolute',
        bottom:260,
        right:1,
        width:40,
        height:70,
        backgroundColor:'#FFE957CC',
        borderTopLeftRadius:5,
        borderBottomLeftRadius:5,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    floatIcon:{

    },
    floatText:{
        fontSize:16,
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
        backgroundColor: "#FDFDFD"
    },
    answerPanel:{
        flexWrap:'wrap',
        width:'100%',
        padding:10,
        borderTopWidth:1,
        borderColor:'#999'
    },  
    modalAnswerOption:{
        borderWidth:StyleSheet.hairlineWidth,
        borderRadius:6,
        backgroundColor:'#EFEFEF',
        paddingHorizontal:4,
        marginRight:18,
        marginBottom:10,
    }
});


export default styles;