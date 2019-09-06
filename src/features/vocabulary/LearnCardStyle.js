
import {StyleSheet} from 'react-native'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    nextBtn:{
        width:60,
        height:60,
        backgroundColor:'#FFE957',
        borderRadius:50,
        elevation:5,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        bottom:10,
        alignSelf:'center'
    }
});

export default styles