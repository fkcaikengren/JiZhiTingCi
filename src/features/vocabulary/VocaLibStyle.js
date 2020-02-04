
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

    emFont: {
        fontSize: 16,
        color: gstyles.emColor,
    }
});

export default styles