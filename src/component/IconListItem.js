import React, {Component} from 'react';
import {Platform, ViewPropTypes, StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import {PropTypes} from 'prop-types';
import AliIcon from './AliIcon';


const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft: 20,
    },
});

/**
 *Created by Jacy on 19/05/23.
 */
export default class IconListItem extends React.Component {

    constructor(props){
        super(props);
        this.state={}
    }
    
    render(){
        let {leftIcon, title,subtitle,rightIcon, arrow, onPress} = this.props;
        return(
            <TouchableOpacity onPress={()=>{
                onPress();
            }}>
            <View style={[styles.container, this.props.containerStyle]}>
                <View style={{
                    flexDirection:'row',
                    justifyContent:'flex-start',
                    alignItems:'center',

                }}>
                    {leftIcon ?leftIcon : null}
                    <Text numberOfLines={1} style={[this.props.titleStyle]}>{title}</Text>
                </View>
                <View style={{
                    flexDirection:'row',
                    justifyContent:'flex-start',
                    alignItems:'center',
                }}>
                    {subtitle ?<Text numberOfLines={1} style={{color:'#808080'}}>{subtitle}</Text> : null}
                    {rightIcon ? rightIcon : null}
                    {arrow ?<AliIcon name='youjiantou' size={26} color='#A0A0A0'></AliIcon>:null}
                </View>
            </View>
            </TouchableOpacity>
        );
    }


    // 声明组件参数类型
    static propTypes = {
        containerStyle: ViewPropTypes.style,
        titleStyle: ViewPropTypes.style,
        leftIcon: PropTypes.element, 
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        rightIcon: PropTypes.element, 
        arrow: PropTypes.bool, 
        onPress: PropTypes.func,
    }

    // 组件参数默认属性
    static defaultProps = {
        containerStyle:{
            paddingTop: 20,
        },
        titleStyle:{
            fontSize: 16, 
            color:'#303030',
            paddingLeft:10,
        },
        arrow: true,
        onPress: ()=>{},
    }
}