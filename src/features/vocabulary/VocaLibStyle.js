
import { StyleSheet } from 'react-native'
import gstyles from '../../style';

const styles = StyleSheet.create({


    bookView: {
        width: '100%',
        paddingVertical: 15,
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
        paddingRight: 10,
        marginBottom: 10,
    },
    bookname: {
        flex: 4,
        fontSize: 16,
        color: '#303030',
        fontWeight: '500',
    },
    note: {
        flex: 6,
        fontSize: 13,
        textAlignVertical: "center"
    },
    price: {
        flex: 3,
        fontSize: 14,
        color: 'red',
    },
    wordCount: {
        fontSize: 14,
        color: '#444'
    },

    payedBadge: {
        position: 'absolute',
        bottom: 5,
        right: 0,
        padding: 2,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: 'red'
    }

});

export default styles