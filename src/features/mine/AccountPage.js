import React, { Component } from 'react';
import { Platform, StatusBar, View, Text, Image, TouchableOpacity, BackHandler } from 'react-native';
import { Header, } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker';

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import styles from './AccountStyle'


export default class AccountPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: {}, avatarSource: null }
    }


    componentDidMount() {
        console.log('加载')
        this._init()
    }

    _init = async () => {
        try {
            const user = await Storage.load({ key: 'user' })
            if (user !== null) {
                this.setState({ user })
            }
        } catch (e) {
            console.log(e)
        }
    }

    componentWillUnmount() {
    }


    //退出登录
    _logout = () => {
        BackHandler.exitApp()
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
        let { user, avatarSource } = this.state
        const source = avatarSource ? avatarSource : require('../../image/bg.jpg')
        return (
            <View style={styles.container}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
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
                    {
                        this._renderItem('头像',
                            <Image style={styles.imgStyle} source={source} />,
                            () => { //调用相册
                                const options = {
                                    title: 'Select Avatar',
                                    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
                                    storageOptions: {
                                        skipBackup: true,
                                        path: 'images',
                                    },
                                };
                                ImagePicker.launchImageLibrary(options, (response) => {
                                    console.log(response)
                                    if (response.error) {
                                        console.log('ImagePicker Error: ', response.error);
                                    } else {
                                        const source = { uri: response.uri };

                                        // You can also display the image using data:
                                        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                                        this.setState({
                                            avatarSource: source,
                                        });
                                    }
                                });
                            })
                    }
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

                    {
                        this._renderItem('手机', user.phone ? user.phone :
                            <AliIcon name='shouji' size={26} color={gstyles.gray} />)
                    }
                    {
                        this._renderItem('修改密码', null, () => {
                            this.props.navigation.navigate('Password')
                        }, false)
                    }
                    <TouchableOpacity activeOpacity={0.8}
                    // onPress={}
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

