import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Switch, BackHandler } from 'react-native';
import { Header, ButtonGroup } from 'react-native-elements'
import { connect } from 'react-redux';

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import styles from './SettingStyle'
import { VOCA_PRON_TYPE_AM, VOCA_PRON_TYPE_EN } from '../vocabulary/common/constant';
import * as MineAction from './redux/action/mineAction'


class SettingPage extends React.Component {
    constructor(props) {
        super(props);
        const {
            configVocaPronType,
            configReviewPlayTimes } = this.props.mine
        let selectedIndex = 0
        if (configVocaPronType === VOCA_PRON_TYPE_EN) {
            selectedIndex = 1
        }
        this.state = {
            selectedIndex,
            times: configReviewPlayTimes
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this._goBack()
            return true
        })
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }

    _renderItem = ({ title, rightComponent, onPress = _ => { } }) => {
        return <View style={[gstyles.r_between, styles.itemView]}
            onStartShouldSetResponder={e => true}
            onResponderStart={onPress}>
            <Text numberOfLines={1} style={[gstyles.md_black_bold, { marginLeft: 20 }]}>
                {title}
            </Text>
            {
                rightComponent
            }
        </View>
    }


    _updateIndex = (selectedIndex) => {
        if (selectedIndex === 0) {
            this.props.changeConfigVocaPronType(VOCA_PRON_TYPE_AM)
        } else {
            this.props.changeConfigVocaPronType(VOCA_PRON_TYPE_EN)
        }
        this.setState({ selectedIndex })
    }


    _goBack = () => {
        //修改复习轮播遍数
        if (this.props.mine.configReviewPlayTimes !== this.state.times) { //发生改变
            console.log(this.state.times)
            this.props.changeConfigReviewPlayTimes(this.state.times)
        }

        this.props.navigation.goBack();
    }

    render() {
        const { selectedIndex } = this.state
        const { configShowNTrans, configShowMTrans, configAutoPlaySen } = this.props.mine
        return (
            <View style={[{ flex: 1, backgroundColor: '#EFEFEF' }, gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content'
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this._goBack()

                        }} />}
                    centerComponent={{ text: '设置', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                <View style={{ width: '100%', marginTop: 10 }}>
                    {
                        this._renderItem({
                            title: '单词发音',
                            rightComponent: <View style={{ marginRight: 9 }}>
                                <ButtonGroup
                                    onPress={this._updateIndex}
                                    selectedIndex={selectedIndex}
                                    buttons={['美', '英']}
                                    containerStyle={{ width: 100, height: 34 }}
                                    selectedButtonStyle={{ backgroundColor: gstyles.secColor }}
                                />
                            </View>
                        })
                    }
                    {
                        this._renderItem({
                            title: '复习播放遍数',
                            rightComponent: <View style={[gstyles.r_center, { marginRight: 20 }]}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    if (this.state.times >= 4) {
                                        this.setState({ times: this.state.times - 1 })
                                    }
                                }}>
                                    <View style={[gstyles.r_center, styles.timesBtn, styles.subBtn,]}>
                                        <Text style={{ fontSize: 26 }}>-</Text>
                                    </View>

                                </TouchableOpacity>
                                <View style={[gstyles.r_center, styles.times]}>
                                    <Text >{this.state.times}</Text>
                                </View>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    if (this.state.times <= 14) {
                                        this.setState({ times: this.state.times + 1 })
                                    }

                                }}>
                                    <View style={[gstyles.r_center, styles.timesBtn, styles.plusBtn]}>
                                        <Text style={{ fontSize: 20 }}>+</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        })
                    }
                    {
                        this._renderItem({
                            title: '显示普通例句翻译',
                            rightComponent: <View style={{ marginRight: 12 }}>
                                <Switch
                                    value={configShowNTrans}
                                    onValueChange={(value) => {
                                        this.props.changeConfigNTrans(value)
                                    }}
                                    thumbColor={gstyles.secColor}
                                    trackColor={{ false: '#DDD', true: gstyles.secColor + '66' }} />
                            </View>
                        })
                    }
                    {
                        this._renderItem({
                            title: '显示影视例句翻译',
                            rightComponent: <View style={{ marginRight: 12 }}>
                                <Switch
                                    value={configShowMTrans}
                                    onValueChange={(value) => {
                                        this.props.changeConfigMTrans(value)
                                    }}
                                    thumbColor={gstyles.secColor}
                                    trackColor={{ false: '#DDD', true: gstyles.secColor + '66' }} />
                            </View>
                        })
                    }
                    {
                        this._renderItem({
                            title: '自动播放例句',
                            rightComponent: <View style={{ marginRight: 12 }}>
                                <Switch
                                    value={configAutoPlaySen}
                                    onValueChange={(value) => {
                                        this.props.changeConfigAutoPlaySen(value)
                                    }}
                                    thumbColor={gstyles.secColor}
                                    trackColor={{ false: '#DDD', true: gstyles.secColor + '66' }} />
                            </View>
                        })
                    }

                </View>



                <View style={{ width: '100%', marginTop: 20 }}>
                    {
                        this._renderItem({
                            title: '联系我们',
                            rightComponent: <View style={[gstyles.r_start, { marginRight: 10 }]}>
                                <AliIcon name='youjiantou' size={26} color={gstyles.gray} />
                            </View>,
                            onPress: () => {
                                this.props.navigation.navigate('About')
                            }
                        })
                    }
                    {
                        this._renderItem({
                            title: '给个好评',
                            rightComponent: <View style={[gstyles.r_start, { marginRight: 10 }]}>
                                <AliIcon name='youjiantou' size={26} color={gstyles.gray} />
                            </View>,
                            onPress: () => {
                                this.props.app.toast.show('暂不支持')
                            }
                        })
                    }

                </View>


                <View style={[gstyles.r_center, styles.version]}>
                    <Text style={{ fontSize: 18, color: '#666' }}>爱听词 v1.0.4</Text>
                </View>


            </View>
        );
    }
}


const mapStateToProps = state => ({
    app: state.app,
    mine: state.mine,
})

const mapDispatchToProps = {
    changeConfigVocaPronType: MineAction.changeConfigVocaPronType,
    changeConfigNTrans: MineAction.changeConfigNTrans,
    changeConfigMTrans: MineAction.changeConfigMTrans,
    changeConfigAutoPlaySen: MineAction.changeConfigAutoPlaySen,
    changeConfigReviewPlayTimes: MineAction.changeConfigReviewPlayTimes
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingPage)