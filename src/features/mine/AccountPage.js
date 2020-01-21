import React, { Component } from 'react';
import { Platform, StatusBar, View, Text, Image, TouchableOpacity } from 'react-native';
import { Header, } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker';

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import styles from './AccountStyle'
import { connect } from 'react-redux';
import * as MineAction from './redux/action/mineAction'
import VocaTaskDao from '../vocabulary/service/VocaTaskDao';
import VocaGroupDao from '../vocabulary/service/VocaGroupDao';


class AccountPage extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }


    //退出登录
    _logout = () => {
        this.props.app.confirmModal.show("确认退出登录！", null, () => {
            //同步数据
            Storage.clearMapForKey('notSyncTasks')
            Storage.clearMapForKey('notSyncGroups')
            //清空token和user
            this.props.logout()
            //清空任务数据
            VocaTaskDao.getInstance().deleteAllTasks()
            //清空生词本数据
            VocaGroupDao.getInstance().deleteAllGroups()

            //跳转到auth
            this.props.navigation.navigate('AuthLoading')
        })
    }

    _changeAvatar = () => { //调用相册
        const options = {
            title: '选择图片',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (result) => {
            if (result.didCancel) {
                console.log('User cancelled image picker');
            } else if (result.error) {
                console.log('ImagePicker Error: ', result.error);
            } else if (result.customButton) {
                console.log('User tapped custom button: ', result.customButton);
            } else {
                //modifyAvatar
                this.props.modifyAvatar({
                    token: this.props.mine.token,
                    result: result
                })
                // const source = { uri: result.uri };
                // this.setState({
                //     avatarSource: source,
                // });
            }
        });
    }

    // Item
    _renderItem = (title, rightPart = null, onPress = () => null, hasBorderLine = true) => {
        const isText = (typeof rightPart === 'string')
        const borderLine = hasBorderLine ? null : { borderBottomWidth: 0 }
        return <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.itemWrapper}>
                <View style={[gstyles.r_start, styles.itemView, borderLine]}>
                    <View style={[{ flex: 1 }, gstyles.r_start]}>
                        <Text numberOfLines={1} style={gstyles.lg_black}>{title}</Text>
                    </View>
                    <View style={gstyles.r_start}>
                        {isText &&
                            <Text numberOfLines={1} style={gstyles.lg_gray}>{rightPart}</Text>
                        }
                        {!isText &&
                            rightPart
                        }
                        <AliIcon name='youjiantou' size={26} color={gstyles.gray}
                            style={{ marginLeft: 10, marginRight: 10 }} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    }

    render() {
        const { user, avatarSource } = this.props.mine
        const source = avatarSource ? avatarSource : require('../../image/bg.jpg')
        return (
            <View style={styles.container}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content'
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();
                        }} />}

                    centerComponent={{ text: '个人中心', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                <View style={styles.mainView}>
                    {/* 头像 */}
                    {
                        this._renderItem('头像',
                            <Image style={styles.imgStyle}
                                source={source} />,
                            this._changeAvatar)
                    }
                    {/* 昵称 */}
                    {
                        this._renderItem('昵称', user.nickname, () => {
                            this.props.navigation.navigate('Nickname', {
                                nickname: user.nickname
                            })
                        })
                    }

                    {/* {
                        this._renderItem('绑定微信', <AliIcon name='weixin' size={26} color='#30DE76' />)
                    }
                    {
                        this._renderItem('绑定QQ', <AliIcon name='qq' size={26} color='#3EC6FB' />)
                    } */}
                    {/* 手机号 */}
                    {
                        this._renderItem('手机', user.phone ? user.phone :
                            <AliIcon name='shouji' size={26} color={gstyles.gray} />)
                    }
                    {/* 密码 */}
                    {
                        this._renderItem('修改密码', null, () => {
                            this.props.navigation.navigate('Password')
                        }, false)
                    }
                    <TouchableOpacity activeOpacity={0.8}
                        onPress={this._logout}
                    >
                        <View style={[gstyles.r_center, styles.logout]}>
                            <Text style={[gstyles.lg_black, { color: 'red' }]}>退出登录</Text>
                        </View>
                    </TouchableOpacity>
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
    modifyAvatar: MineAction.modifyAvatar,
    logout: MineAction.logout,
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)