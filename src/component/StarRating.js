import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types'

export default class StarRating extends Component {
    static defaultProps = {
        maxStars: 5,
        rating: 1,
    };
    static propTypes = {
        maxStars: PropTypes.number,
        rating: PropTypes.number,
        unSelectStar: PropTypes.element.isRequired,
        selectStar: PropTypes.element.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            maxStars: this.props.maxStars,
            rating: this.props.rating,
        };
    }

    render() {
        let starArray = [];
        let Star = null;
        for (let i = 1; i <= this.state.maxStars; i++) {
            if (i <= this.props.rating) {
                Star = this.props.selectStar;
            }
            else {
                Star = this.props.unSelectStar;
            }
            //push Element
            starArray.push(Star);
        }
        return (
            <View
                style={styles.container}
            >
                {starArray}
            </View>
        )
    }

};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
