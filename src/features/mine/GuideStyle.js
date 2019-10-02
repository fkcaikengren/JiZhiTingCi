
import {StyleSheet} from 'react-native'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({

    itemThumb:{
        width:120,
        height:100,
        borderRadius:3,
    },
    itemContent:{
        width:width-120,
        marginHorizontal:10
    }

});

export default styles