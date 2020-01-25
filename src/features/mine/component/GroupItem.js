
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';
import gstyles from '../../../style';
import AliIcon from '../../../component/AliIcon';

export default class GroupItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            title,
            rightComponent,
            hasBorderLine,
            hasArrow,
            onPress
        } = this.props
        const isText = (typeof rightComponent === 'string')
        const borderLine = hasBorderLine ? null : { borderBottomWidth: 0 }
        return <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.itemWrapper}>
                <View style={[gstyles.r_start, styles.itemView, borderLine]}>
                    <View style={[{ flex: 1 }, gstyles.r_start]}>
                        <Text numberOfLines={1} style={gstyles.lg_black}>{title}</Text>
                    </View>
                    <View style={gstyles.r_start}>
                        {isText &&
                            <Text numberOfLines={1} style={gstyles.lg_gray}>{rightComponent}</Text>
                        }
                        {!isText &&
                            rightComponent
                        }
                        <AliIcon name='youjiantou' size={26} color={gstyles.gray}
                            style={{ marginLeft: 10, marginRight: 10 }} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>


    }

}

const styles = StyleSheet.create({

    itemWrapper: {
        paddingLeft: 12,
        backgroundColor: '#FDFDFD'
    },

    itemView: {
        height: 50,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#DFDFDF',
    },
});

GroupItem.propTypes = {
    title: PropTypes.string,
    rightComponent: PropTypes.any,
    hasBorderLine: PropTypes.bool,
    hasArrow: PropTypes.bool,
    onPress: PropTypes.func
};

GroupItem.defaultProps = {
    title: 'Title',
    rightComponent: null,
    hasBorderLine: true,
    hasArrow: true,
    onPress: () => null
};