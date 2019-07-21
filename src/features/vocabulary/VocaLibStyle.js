
import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#FDFDFD',
        flex: 1
    },
    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    c_center:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    iconText:{
        width:32,
        height:32, 
        backgroundColor:'#1890FF', 
        textAlign:'center', 
        lineHeight:32, 
        borderRadius:50,
    },
    planBook:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#FDFDFD',
        borderRadius:5,
        marginTop:10,
        padding:5,
    },
    grid: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    bookCard: {
        width:75,
        height:100,
        marginBottom:10,
    },
    img: {
        width:90,
        height:120,
    },
    bookname: {
        fontSize: 16,
        color:'#303030',
        fontWeight:'500',
    },
    noteText:{
        fontSize: 12,
    }
});

export default styles