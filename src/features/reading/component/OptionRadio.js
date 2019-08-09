import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {StyleSheet,View, Text,} from 'react-native';
import gstyles from '../../../style'

const Dimensions = require('Dimensions');


const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'flex-start',
    },
    
})

export default  class OptionRadio extends Component{
    constructor(props, context){
        super(props, context)

        this.state = {
            selectedIndex: this.props.selectedIndex,
        } 
    }


    /**
     * @description 选择后自动调用改函数
     */
    onChange = (index, option)=>{
        this.setState({selectedIndex:index})
        this.props.onChange(index, option)
    }
  

    render(){
        

        return(
            <View style={[styles.container, this.props.containerStyle]}>
            {
                this.props.options.map((option,index)=>{
                    let selectedStyle = {}
                    if(index === this.state.selectedIndex){
                        selectedStyle = {
                            backgroundColor: this.props.activeBgColor,
                        }
                    }
                
                    return <View style={[gstyles.r_start]}>
                        <View 
                        onStartShouldSetResponder={(e)=>true}
                        onResponderGrant={(e)=>{this.onChange(index, option)}}
                        style={[gstyles.r_center,{
                            width:this.props.size,
                            height:this.props.size,
                            backgroundColor:this.props.bgColor,
                            borderRadius: 60,
                            marginRight:10,
                        }, selectedStyle]}>
                            <Text style={{fontSize:16, color:'#303030'}}>{option.identifier}</Text>
                        </View>
                        <Text style={{fontSize:16, color:'#303030'}}>{option.content}</Text>
                    </View>
                })
            }
            </View>
        )
    }
}

OptionRadio.propTypes  = {
    onChange: PropTypes.func,
    options: PropTypes.array.isRequired,
    selectedIndex:  PropTypes.number,
    bgColor: PropTypes.string,
    activeBgColor: PropTypes.string,
    size:PropTypes.number,
    containerStyle: PropTypes.object,
    
}

OptionRadio.defaultProps = {
    onChange:(index, option)=>{alert(option)},
    selectedIndex:0,
    bgColor:'#DDD',
    activeBgColor:'#FFE957',
    size:30,
    containerStyle: {}
}