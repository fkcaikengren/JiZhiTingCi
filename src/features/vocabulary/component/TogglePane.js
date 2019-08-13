
import React, { Component } from 'react';
import {StyleSheet, Text, View, } from 'react-native';
import {PropTypes} from 'prop-types';


export default class TogglePane extends Component {

  constructor(props) {
    super(props);
    this.state = {
        show:false
    }
  }
  render() {
    const coverStyle = {
        backgroundColor: this.props.coverColor
    }
    return (
      <View style={[styles.container, 
        this.props.containerStyle, 
        this.state.show? null: coverStyle ]}
        onStartShouldSetResponder={() => true}
        onResponderStart={(e)=>{this.setState({show:!this.state.show})}}
      >
          {this.state.show &&
            <Text numberOfLines={1}>{this.props.content}</Text>
          }
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    text:{

    }
});

TogglePane.propTypes = {
  content: PropTypes.string.isRequired,
  containerStyle:  PropTypes.object,
  coverColor: PropTypes.string,
};

TogglePane.defaultProps = {
  containerStyle: {},
  coverColor: '#AAA',
};