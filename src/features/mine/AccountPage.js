import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Header, } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker';
import GroupItem from './component/GroupItem';
import AliIcon from '../../component/AliIcon';
import { connect } from 'react-redux';
import * as MineAction from './redux/action/mineAction'
import VocaTaskDao from '../vocabulary/service/VocaTaskDao';
import VocaGroupDao from '../vocabulary/service/VocaGroupDao';
import gstyles from "../../style";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
    },
    mainView: {
        marginTop: 16,
        borderTopColor: '#DFDFDF',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#DFDFDF',
        borderBottomWidth: StyleSheet.hairlineWidth,

    },


    logout: {
        height: 50,
        marginTop: 10,
        backgroundColor: '#FDFDFD',
        borderTopColor: '#DFDFDF',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#DFDFDF',
        borderBottomWidth: StyleSheet.hairlineWidth,

    },
    imgStyle: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },

});

class AccountPage extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }


    //退出登录
    _logout = () => {
        this.props.app.confirmModal.show("确认退出登录！", null, () => {
            //1.同步数据

            //2.清空Storage 
            Storage.clearMapForKey('notSyncTasks')
            Storage.clearMapForKey('notSyncGroups')
            this.props.logout() //清空token和user
            //3.清空realm 
            VocaTaskDao.getInstance().deleteAllTasks() //清空任务数据
            VocaGroupDao.getInstance().deleteAllGroups() //清空生词本数据

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
                    ...this.props.mine.credential,
                    result: result
                })
                // const source = { uri: result.uri };
                // this.setState({
                //     avatarSource: source,
                // });
            }
        });
    }



    render() {
        const { user, avatarSource } = this.props.mine
        const source = avatarSource ? avatarSource : require('../../image/bg.jpg')
        let sex = '未填写'
        switch (user.sex) {
            case 0:
                sex = '女'
                break
            case 1:
                sex = '男'
                break
        }

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
                    <GroupItem
                        title='头像'
                        rightComponent={<Image style={styles.imgStyle} source={source} />}
                        onPress={this._changeAvatar}
                    />
                    <GroupItem
                        title='昵称'
                        rightComponent={user.nickname}
                        onPress={() => {
                            this.props.navigation.navigate('Nickname', {
                                nickname: user.nickname
                            })
                        }}
                    />
                    <GroupItem
                        title='性别'
                        rightComponent={sex}
                        onPress={() => {

                        }}
                    />
                    <GroupItem
                        title='绑定微信'
                        rightComponent={<AliIcon name='weixin' size={26} color={user.wechat ? '#30DE76' : gstyles.gray} />}
                        onPress={() => {

                        }}
                    />
                    <GroupItem
                        title='绑定QQ'
                        rightComponent={<AliIcon name='qq' size={26} color={user.qq ? '#3EC6FB' : gstyles.gray} />}
                        onPress={() => {

                        }}
                    />
                    <GroupItem
                        title='绑定手机'
                        rightComponent={user.phone ? user.phone :
                            <AliIcon name='shouji' size={26} color={gstyles.gray} />}
                        onPress={() => {

                        }}
                    />
                    <GroupItem
                        title='修改密码'
                        hasBorderLine={false}
                        onPress={() => {
                            this.props.navigation.navigate('Password')
                        }}
                    />


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