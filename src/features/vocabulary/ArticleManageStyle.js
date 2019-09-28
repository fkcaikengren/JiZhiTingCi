
import {StyleSheet} from 'react-native'
const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    nameView: {
        flex: 1
    },
    noteView:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    noteText: {
        fontSize:12,
        lineHeight: 24,
        marginLeft:3,
    },
})

export default styles