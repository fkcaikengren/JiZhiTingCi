import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Header, Button } from 'react-native-elements'
import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import { connect } from 'react-redux';
import * as MineAction from './redux/action/mineAction'


const styles = StyleSheet.create({
    content: {
        width: '80%',
        marginTop: 25,
    },
    inputStyle: {
        height: gstyles.mdHeight,
        width: '100%',
        borderBottomColor: "#DFDFDF",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    buttonStyle: {
        height: gstyles.mdHeight,
        backgroundColor: '#FFE957',
        borderRadius: 8
    }
})

class NicknamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: this.props.navigation.getParam('nickname')
        }
    }

    componentDidMount() {
    }

    _changeNickname = (nickname) => {
        this.setState({ nickname })
    }
    _modifyNickname = async () => {
        if (this.state.nickname === '') {
            alert('昵称不能为空')
        } else {
            this.props.modifyNickname({
                nickname: this.state.nickname,
                cb: (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        this.props.navigation.goBack()
                    }
                }
            })
        }
    }
    render() {
        return (
            <View style={[{ flex: 1 }, gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();
                        }} />}

                    centerComponent={{ text: '修改昵称', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                <View style={[gstyles.c_start, styles.content]}>
                    <TextInput
                        maxLength={12}
                        style={[styles.inputStyle, gstyles.lg_black]}
                        value={this.state.nickname}
                        onChangeText={this._changeNickname}
                    />
                    <Button
                        disabled={(this.state.password === null || this.state.password === '')}
                        title="确认修改"
                        titleStyle={gstyles.lg_black}
                        buttonStyle={styles.buttonStyle}
                        containerStyle={{ width: '100%', marginTop: 25 }}
                        onPress={this._modifyNickname}
                    />
                </View>

            </View>
        );
    }
}


const mapStateToProps = state => ({
    app: state.app,
    mine: state.mine
})

const mapDispatchToProps = {
    modifyNickname: MineAction.modifyNickname,
}

export default connect(mapStateToProps, mapDispatchToProps)(NicknamePage)