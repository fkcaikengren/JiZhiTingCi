import React, { Component } from "react";
import { View, BackHandler } from "react-native";
import { Header } from "react-native-elements";
import VocaCard from "./component/VocaCard";
import AliIcon from '../../component/AliIcon'
import gstyles from '../../style'
import VocaDao from './service/VocaDao'
import LookWordBoard from "./component/LookWordBoard";



export default class VocaDetailPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            wordInfo: null
        }
    }

    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
        const word = this.props.navigation.getParam('word')
        const wordInfo = VocaDao.getInstance().getWordInfo(word)
        this.setState({ wordInfo })
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress')

    }

    render() {
        const word = this.props.navigation.getParam('word')
        return (
            <View style={{ flex: 1 }}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={<AliIcon name='fanhui' size={24} color={gstyles.black} onPress={() => {
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
                    <VocaCard
                        navigation={this.props.navigation}
                        lookWord={this.wordBoard.lookWord}
                        wordInfo={this.state.wordInfo}
                    />
                }
                <LookWordBoard
                    ref={ref => this.wordBoard = ref}
                    navigation={this.props.navigation}
                />
            </View>
        );
    }


}
