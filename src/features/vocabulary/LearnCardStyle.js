
import {StyleSheet} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    row:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    col:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    iconText:{
        width:32,
        height:32, 
        backgroundColor:'#1890FF', 
        textAlign:'center', 
        lineHeight:32, 
        borderRadius:50,
    },
    bottomBtn:{
        width: (width-80)/2,
        elevation: 0,
        backgroundColor: '#1890FF',

    }, 
    fonts:{
        fontSize:16,
        color:'#404040',
        lineHeight:24,
    },
    phonetic:{
        fontSize: 16,
        color: '#101010',
    }
});

export default styles