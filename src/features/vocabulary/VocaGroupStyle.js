import {StyleSheet} from 'react-native'
import gstyles from '../../style';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        backgroundColor: gstyles.bgGray,
        flex: 1
    },
    content:{
        flex:1,
        paddingHorizontal:10,
    },
   
    groupItem:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#FFF',
        borderRadius:12,
        marginTop:16, 
        paddingVertical:10
    },
    iconBg:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FFE957',
        width:40,
        height:40,
        borderRadius:100,
        marginLeft:10,
    },
    modal: {
        flex:1,
        width:'75%',
        height: 200,
        position: 'absolute',
        bottom: 0,
        backgroundColor: "#FFF",
        borderRadius:12,
    },
    inputStyle:{
        height:40,
        width:'70%',
        fontSize:16,
        color:'#888',
        borderWidth:1,
        borderRadius:5,
        marginTop:16,
    },
    modalBtnGroup:{
        flex:1,
        width:'80%',
        height:'24%'
    }

});

export default styles