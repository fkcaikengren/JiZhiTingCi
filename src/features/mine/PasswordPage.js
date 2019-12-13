import React, { Component } from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Header, Button } from 'react-native-elements'

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import { connect } from 'react-redux'
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

class PasswordPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { password: null }
    }

    componentDidMount() {
    }

    _changePassword = (password) => {
        this.setState({ password })
    }
    _modifyPassword = async () => {
        if (this.state.password === null || this.state.password.length <= 5 || this.state.password.length >= 13) {
            this.props.app.toast.show('格式不对', 1000)
        } else {
            this.props.modifyPassword({
                password: this.state.password,
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

                    centerComponent={{ text: '修改密码', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                <View style={[gstyles.c_start, styles.content]}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="请输入6-12位数字+字母"
                        maxLength={12}
                        style={[styles.inputStyle, gstyles.lg_black]}
                        value={this.state.password}
                        onChangeText={this._changePassword}

                    />
                    <Button
                        disabled={(this.state.password === null || this.state.password === '')}
                        title="确认修改"
                        titleStyle={gstyles.lg_black}
                        buttonStyle={styles.buttonStyle}
                        containerStyle={{ width: '100%', marginTop: 25 }}
                        onPress={this._modifyPassword}
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
    modifyPassword: MineAction.modifyPassword
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordPage)

