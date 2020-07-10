
import React, { Component } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { PropTypes } from 'prop-types';
import VocaDao from '../service/VocaDao'
import VocaUtil from '../common/vocaUtil';
import gstyles from '../../../style';

export default class TogglePanel extends Component {

  constructor(props) {
    super(props);
    this.vocaDao = VocaDao.getInstance()

    this.state = {
      content: null
    }
  }

  _toggleWord = () => {
    let content = this.state.content
    if (content) {
      content = null
    } else {
      if (this.props.isWord) {
        const wordInfo = this.vocaDao.getWordInfo(this.props.word)
        content = wordInfo ? wordInfo.translation : null
      } else {
        content = this.props.word ? this.props.word : ' '
      }
    }

    this.setState({ content })
  }

  render() {
    const coverStyle = {
      backgroundColor: this.props.coverColor
    }
    console.log(coverStyle)
    return (
      <View style={[
        { flex: 1, width: '100%', borderRadius: 2 },
        gstyles.r_start,
        this.props.containerStyle,
        this.state.content ? null : coverStyle]}
        onStartShouldSetResponder={() => true}
        onResponderRelease={(e) => { this._toggleWord() }}

      >
        {this.state.content &&
          <Text style={this.props.textStyle} numberOfLines={1}>{this.state.content}</Text>
        }
      </View>
    );
  }

}



TogglePanel.propTypes = {
  word: PropTypes.string.isRequired,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  coverColor: PropTypes.string,
  isWord: PropTypes.bool
};

TogglePanel.defaultProps = {
  containerStyle: null,
  textStyle: null,
  coverColor: '#BFBFBF',
  isWord: true
};