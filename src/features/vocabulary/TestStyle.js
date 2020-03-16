import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    content: {
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '35%'
    },
    phoneticView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wordFont: {
        fontSize: 30,
        color: '#202020',
        fontWeight: '600'
    },
    selectBtn: {
        backgroundColor: '#EFEFEF',
        borderRadius: 8,
        height: 50,
    },
    modalBottom: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        height: 60,
        flex: 1,
        paddingHorizontal: 10,
    },
})

export default styles