
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FDFDFD',
        flex: 1
    },

    iconText: {
        width: 32,
        height: 32,
        backgroundColor: '#1890FF',
        textAlign: 'center',
        lineHeight: 32,
        borderRadius: 50,
    },
    planBook: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FDFDFD',
        borderRadius: 5,
        marginTop: 10,
        padding: 5,
    },
    grid: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookView: {
        width: '100%',
        paddingVertical: 10,
    },
    imgCard: {
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 20,
    },
    img: {
        width: 70,
        height: 100,
    },
    bookContent: {
        flex: 1,
        height: 100,
        // borderWidth: 1,
        paddingBottom: 4,
    },
    bookname: {
        fontSize: 16,
        color: '#303030',
        fontWeight: '500',
    },
    note: {
        fontSize: 13,
        marginTop: 10,
    },
    wordCount: {
        fontSize: 14,
        color: '#444'
    }
});

export default styles