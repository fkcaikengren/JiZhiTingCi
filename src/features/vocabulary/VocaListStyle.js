
import { StyleSheet } from 'react-native'

import gstyles from '../../style'

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FDFDFD',
        flex: 1,
    },
    editBtn: {
        fontSize: 14,
        color: '#303030',
        borderWidth: StyleSheet.hairlineWidth,
        padding: 2,
        borderRadius: 2,
        borderColor: '#555'
    },

    headerView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 30,
        paddingVertical: 4,
        paddingLeft: 10,
        backgroundColor: '#EFEFEF'
    },
    headerText: {
        color: '#444',
        fontSize: 14
    },
    item: {
        height: 45,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EFEFEF'
    },
    itemLeft: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden'
    },
    itemCenter: {
        flex: 4,
        paddingLeft: 10,
        paddingVertical: 10,
    },
    accordionItem: {
        height: 45,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#EFEFEF',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center'

    },
    accordionTitle:{
        height: 45,
        lineHeight:45,
        width:100,
        textAlignVertical:'center',
        color: '#444',
        fontSize: 16,
        paddingLeft:10,
    },

    checkBox: {
        margin: 0,
        padding: 0,
    },
    word: {
        color: '#303030',
        fontSize: 16,
    },

    bottomBtn: {
        position: 'absolute',
        alignSelf: 'center',
        width: '60%',
        height: 40,
        bottom: 10,
    }
});

export default styles