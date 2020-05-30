import React from 'react';
import { View, Text, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { Header } from 'react-native-elements'
import gstyles from '../../style';
import AliIcon from '../../component/AliIcon';


export default class H5Page extends React.Component {
    constructor(props) {
        super(props)
        this.url = this.props.navigation.getParam("url")
        this.title = this.props.navigation.getParam("title")
    }


    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }

    render() {
        return (
            <View style={[{ flex: 1 }, gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content'
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack()
                        }} />}
                    centerComponent={{ text: this.title, style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: '#FFF',
                        justifyContent: 'space-around',
                    }}
                />
                <View style={{ flex: 1, width: '100%' }}>
                    <WebView
                        source={{ uri: this.url }} />
                </View>
            </View>

        );
    }
}


