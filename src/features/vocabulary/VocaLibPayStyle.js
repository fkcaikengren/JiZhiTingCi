import { StyleSheet } from 'react-native'
import gstyles from '../../style';


const styles = StyleSheet.create({
    featureView: {
        marginTop: 10,
        width: "100%",
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    featureTab: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#F2753F88",
        padding: 4,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        position: "absolute",
        left: 15,
        top: -15,
        zIndex: 100,
    },
    tabFont: {
        fontSize: 16,
        color: gstyles.secColor,
        fontWeight: "bold",
        marginLeft: 5,
    },
    featureBox: {
        width: "100%",
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fafafa',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingTop: 25,
        paddingBottom: 15,
    },
    boxFont: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    movieImg: {
        height: 200,
        width: "100%",
        borderRadius: 8,
    },
    bottomBar: {
        width: "100%",
        height: 60,
        position: "absolute",
        left: 0,
        bottom: 0,
        backgroundColor: '#FFF',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#ddd'
    },
    payNum: {
        fontSize: 32,
        fontWeight: 'bold',
        color: gstyles.emColor,
    },
    payBtn: {
        width: 100,
        height: 40,
        backgroundColor: gstyles.emColor,
        marginRight: 15,
        borderRadius: 8,
    }
});


export default styles