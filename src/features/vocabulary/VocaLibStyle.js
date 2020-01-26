
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
        marginTop: 6,
    },
    price: {
        fontSize: 14,
        color: 'red',
        marginTop: 6,
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