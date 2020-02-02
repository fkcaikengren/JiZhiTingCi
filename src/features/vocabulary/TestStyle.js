import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE',
    },
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
})

export default styles