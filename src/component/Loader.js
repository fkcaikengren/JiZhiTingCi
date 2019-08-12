import React, {Component} from 'react';
const Spinner = require('react-native-spinkit');

export default class Loader extends Component{

    render(){
        return  <Spinner
            isVisible={true} 
            size={60} 
            type={'FadingCircleAlt'} 
            color={'#FFE957'}
            />
    }
}