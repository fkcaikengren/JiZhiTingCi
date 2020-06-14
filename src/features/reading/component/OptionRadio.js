import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import gstyles from '../../../style'



const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingBottom: 16,
        paddingRight: 20,
        // borderWidth:StyleSheet.hairlineWidth
    },
    optionText: {
        fontSize: 16,
        color: '#303030',

    }

})

export default class OptionRadio extends Component {
    constructor(props, context) {
        super(props, context)
    }


    /**
     * @description 选择后自动调用改函数
     */
    onChange = (index, option) => {

        this.props.selectedIndex = index
        this.props.onChange(index, option)
    }


    render() {

        return (
            <View style={[styles.container, this.props.containerStyle]} >
                {
                    this.props.options.map((option, index) => {
                        let selectedStyle = {}
                        if (index === this.props.selectedIndex) {
                            selectedStyle = {
                                backgroundColor: this.props.activeBgColor,
                            }
                        }
                        return <View style={styles.optionRow} key={index.toString()}>
                            <TouchableOpacity onPress={() => { this.onChange(index, option) }}>
                                <View
                                    style={[gstyles.r_center, {
                                        width: this.props.size,
                                        height: this.props.size,
                                        backgroundColor: this.props.bgColor,
                                        borderRadius: 60,
                                        marginRight: 10,
                                    }, selectedStyle]}>
                                    <Text style={[styles.optionText, { lineHeight: this.props.size }]}>
                                        {option.identifier}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={[styles.optionText, { paddingTop: 4, color: this.props.fontColor }]}>{option.content}</Text>
                        </View>
                    })
                }
            </View>
        )
    }
}

OptionRadio.propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.array.isRequired,
    selectedIndex: PropTypes.number,
    bgColor: PropTypes.string,
    fontColor: PropTypes.string,
    activeBgColor: PropTypes.string,
    size: PropTypes.number,
    containerStyle: PropTypes.object,
}

OptionRadio.defaultProps = {
    onChange: (index, option) => { console.log(option) },
    selectedIndex: -1,
    bgColor: '#EEE',
    fontColor: '#303030',
    activeBgColor: '#FFE957',
    size: 30,
    containerStyle: {},

}