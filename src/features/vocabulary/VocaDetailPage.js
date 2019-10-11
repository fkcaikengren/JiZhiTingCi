import React, {Component} from "react";
import { View} from "react-native";
import {Header} from "react-native-elements";
import VocaCard from "./component/VocaCard";
import AliIcon from '../../component/AliIcon'
import gstyles from '../../style'
import VocaDao from './service/VocaDao'

export default class VocaDetailPage extends Component {

    constructor(props){
        super(props)
        this.state = {
            wordInfo:null
        }
    }
    componentDidMount() {
        const word = this.props.navigation.getParam('word')
        console.log(word)
        const wordInfo = VocaDao.getInstance().getWordInfo(word)
        this.setState({wordInfo})
    }

    render() {
        const word = this.props.navigation.getParam('word')
        return (
            <View style={{flex:1}}>
                <Header
                    statusBarProps={{ barStyle:'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={<AliIcon name='fanhui' size={24} color={gstyles.black} onPress={()=>{
                        this.props.navigation.goBack();
                    }} />}
                    centerComponent={{ text: word, style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        borderBottomColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                {this.state.wordInfo &&
                    <VocaCard wordInfo={this.state.wordInfo}/>
                }
            </View>
        );
    }


}
