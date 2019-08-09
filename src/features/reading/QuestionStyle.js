import {StyleSheet, Platform, StatusBar} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');


const styles = StyleSheet.create({
    header:{
        width:width,
        height:40,
        backgroundColor:'#CCC',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        
    },
    headerText:{
        marginLeft:16,
        fontSize:16,
        color:'#303030',
    },
    content:{
        width:width,
        padding:16,
    },
    question:{
        color:'#303030',
        fontSize:16,
        marginBottom:16,
    }
});


export default styles