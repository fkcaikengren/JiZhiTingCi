import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, Image, TouchableOpacity, BackHandler } from 'react-native';
import { Header, } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker';
import GroupItem from './component/GroupItem';
import AliIcon from '../../component/AliIcon';
import { connect } from 'react-redux';
import * as MineAction from './redux/action/mineAction'
import gstyles from "../../style";
import WXService from '../../common/WXService';
import { logoutHandle } from './common/userHandler';
import QQService from '../../common/QQService';
import _util from '../../common/util';



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
    },
    mainView: {
        marginTop: 10,
        borderTopColor: '#DFDFDF',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#DFDFDF',
        borderBottomWidth: StyleSheet.hairlineWidth,

    },

    logout: {
        height: 50,
        marginTop: 20,
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

    sexItem: {
        width: 200,
        height: 50,
        lineHeight: 50,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#AAA',
        textAlign: "center"
    }
});

class AccountPage extends React.Component {
    constructor(props) {
        super(props);
        this._checkNet = _util.checkNet
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            const { commonModal, confirmModal } = this.props.app
            if (commonModal.isOpen()) {
                commonModal.hide()
            } else if (confirmModal.isOpen()) {
                confirmModal.hide()
            } else {
                this.props.navigation.goBack()
            }
            return true
        })
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }


    // 退出登录
    _logout = () => {
        this.props.app.confirmModal.show("确认退出登录！", null, () => {
            //退出登录处理
            logoutHandle()
        })
    }

    // 修改头像
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

            }
        });
    }



    _renderSexSelector = ({ commonModal }) => {
        return () => {
            const {
                hide
            } = commonModal
            return <View style={[gstyles.c_start, { flex: 1, width: "100%" }]}>
                <View style={{ position: "absolute", top: 5, right: 5 }}>
                    <AliIcon name='guanbi' size={26} color='#555' onPress={() => {
                        hide()
                    }} />
                </View>
                <Text style={[gstyles.lg_black, { marginTop: 40, marginBottom: 30 }]}>性别</Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                        this.props.modifySex({ sex: 0 })
                        hide()
                    }}
                >
                    <Text style={[gstyles.md_black, styles.sexItem]}>女</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                        this.props.modifySex({ sex: 1 })
                        hide()
                    }}
                >
                    <Text style={[gstyles.md_black, styles.sexItem]}>男</Text>
                </TouchableOpacity>


            </View>
        }
    }

    render() {
        const { user, avatarSource } = this.props.mine
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
                        rightComponent={<Image style={styles.imgStyle} source={avatarSource} />}
                        onPress={() => {
                            this._checkNet(this._changeAvatar)
                        }}
                    />
                    <GroupItem
                        title='昵称'
                        rightComponent={user.nickname}
                        onPress={() => {
                            this._checkNet(() => {
                                this.props.navigation.navigate('Nickname', {
                                    nickname: user.nickname
                                })
                            })
                        }}
                    />
                    <GroupItem
                        title='性别'
                        rightComponent={sex}
                        onPress={() => {
                            this._checkNet(() => {
                                this.props.app.commonModal.show({
                                    renderContent: this._renderSexSelector({ commonModal: this.props.app.commonModal }),
                                    modalStyle: {
                                        width: 300,
                                        height: 240,
                                        borderRadius: 10,
                                        backgroundColor: "#FFF",
                                    },
                                })
                            })
                        }}
                    />
                    <GroupItem
                        title='绑定微信'
                        rightComponent={<AliIcon name='weixin' size={26} color={user.wechat ? '#30DE76' : gstyles.gray} />}
                        onPress={() => {
                            this._checkNet(async () => {
                                if (user.wechat) {
                                    this.props.app.confirmModal.show("已绑定微信，是否换绑？", null, async () => {
                                        const code = await WXService.getInstance().getCode()
                                        this.props.modifyWechat({ code })
                                    })
                                } else {
                                    const code = await WXService.getInstance().getCode()
                                    this.props.modifyWechat({ code })
                                }
                            })
                        }}
                    />
                    <GroupItem
                        title='绑定QQ'
                        rightComponent={<AliIcon name='qq' size={26} color={user.qq ? '#3EC6FB' : gstyles.gray} />}
                        onPress={() => {
                            this._checkNet(async () => {
                                if (user.qq) {
                                    this.props.app.confirmModal.show("已绑定QQ，是否换绑？", null, async () => {
                                        const result = await QQService.getInstance().getAccess()
                                        this.props.modifyQq({ params: result })
                                    })
                                } else {
                                    const result = await QQService.getInstance().getAccess()
                                    this.props.modifyQq({
                                        params: {
                                            access_token: result.access_token,
                                            openid: result.openid,
                                            oauth_consumer_key: result.oauth_consumer_key
                                        },
                                    })
                                }
                            })
                        }}
                    />
                    <GroupItem
                        title='绑定手机'
                        rightComponent={user.phone ? user.phone :
                            <AliIcon name='shouji' size={26} color={gstyles.gray} />}
                        onPress={() => {
                            this._checkNet(() => {
                                this.props.navigation.navigate("Phone")
                            })
                        }}
                    />
                    <GroupItem
                        title='修改密码'
                        hasBorderLine={false}
                        onPress={() => {
                            this._checkNet(() => {
                                this.props.navigation.navigate('Password')
                            })
                        }}
                    />

                    <TouchableOpacity activeOpacity={0.8}
                        onPress={() => {
                            this._checkNet(this._logout)
                        }}
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
    modifySex: MineAction.modifySex,
    modifyAvatar: MineAction.modifyAvatar,
    modifyWechat: MineAction.modifyWechat,
    modifyQq: MineAction.modifyQq,
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)