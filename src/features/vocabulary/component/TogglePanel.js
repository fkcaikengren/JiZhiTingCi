
import React, { Component } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { PropTypes } from 'prop-types';
import VocaDao from '../service/VocaDao'
import VocaUtil from '../common/vocaUtil';

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
      const wordInfo = this.vocaDao.getWordInfo(this.props.word)
      content = wordInfo ? wordInfo.translation : null
    }
    this.setState({ content })
  }

  render() {
    const coverStyle = {
      backgroundColor: this.props.coverColor
    }
    return (
      <View style={[styles.container,
      this.props.containerStyle,
      this.state.content ? null : coverStyle]}
        onStartShouldSetResponder={() => true}
        onResponderStart={(e) => { this._toggleWord() }}
      >
        {this.state.content &&
          <Text numberOfLines={1}>{this.state.content}</Text>
        }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {

  }
});

TogglePanel.propTypes = {
  word: PropTypes.string.isRequired,
  containerStyle: PropTypes.object,
  coverColor: PropTypes.string,
};

TogglePanel.defaultProps = {
  containerStyle: null,
  coverColor: '#AAA',
};