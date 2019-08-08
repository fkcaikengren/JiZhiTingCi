import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {StyleSheet,View, Text,} from 'react-native';
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
   
})

export default  class ColorRadio extends Component{
    constructor(props, context){
        super(props, context)

        this.state = {
            selectedIndex: this.props.selectedIndex,
        } 
    }


    /**
     * @description 选择后自动调用改函数
     * @param index index范围在0 到  length-1
     * @param colorValue  colors[index]
     * @memberof ColorRadio
     */
    onChange = (index, colorValue)=>{
        this.setState({selectedIndex:index})
        this.props.onChange(index, colorValue)
    }
  

    render(){
        

        return(
            <View style={[styles.container, this.props.containerStyle]}>
            {
                this.props.colors.map((colorValue,index)=>{
                    let selectedStyle = {}
                    if(index === this.state.selectedIndex){
                        selectedStyle = {
                            borderWidth: 1,
                            borderColor: this.props.selectBorderColor,
                        }
                    }
                
                    return <View 
                        onStartShouldSetResponder={(e)=>true}
                        onResponderGrant={(e)=>{this.onChange(index, colorValue)}}
                        style={[selectedStyle,{
                            width:this.props.size,
                            height:this.props.size,
                            backgroundColor:colorValue,
                            borderRadius: 60,
                        }]}>
                            
                    </View>
                })
            }
            </View>
        )
    }
}

ColorRadio.propTypes  = {
    onChange: PropTypes.func,
    colors: PropTypes.array.isRequired,
    selectedIndex:  PropTypes.number,
    selectBorderColor: PropTypes.string,
    size:PropTypes.number,
    containerStyle: PropTypes.object,
    
}

ColorRadio.defaultProps = {
    onChange:(index, value)=>{alert(value)},
    selectedIndex:0,
    selectBorderColor: '#1890FF',
    size:30,
    containerStyle: {}
}