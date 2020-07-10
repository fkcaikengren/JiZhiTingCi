
import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { Grid, Col, Row, } from 'react-native-easy-grid'
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { PropTypes } from 'prop-types';
import BackgroundTimer from 'react-native-background-timer'
import * as Progress from 'react-native-progress';
import AliIcon from '../../../component/AliIcon'
import gstyles from '../../../style';
import styles from './style'


const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');

export default class StudyPlayController extends React.Component {
    constructor(props) {
        super(props);
    }

    //选择播放时间间隔
    _chooseInterval = (interval) => {
        console.log(interval)
        const { changeInterval } = this.props;
        changeInterval(interval);
    }

    //播放暂停切换
    _togglePlay = () => {
        const { autoPlayTimer, task } = this.props.playState;
        const { curIndex } = task
        const { changePlayTimer } = this.props;
        if (autoPlayTimer) {
            //暂停
            clearTimeout(autoPlayTimer);
            changePlayTimer(0);
        } else {
            //播放
            this.props.autoplay(curIndex);
        }
    }

    _toggleWord = () => {
        this.props.toggleWord()

    }
    _toggleTran = () => {
        this.props.toggleTran()
    }
    // 停止播放
    _pause = () => {
        const { autoPlayTimer, task } = this.props.playState;
        const { changePlayTimer } = this.props;
        if (autoPlayTimer) {
            //暂停
            clearTimeout(autoPlayTimer);
            changePlayTimer(0);
        }
    }

    render() {
        const { task, autoPlayTimer, showWord, showTran, interval } = this.props.playState
        const { themes, themeId } = this.props.vocaPlay;
        const { words, wordCount, curIndex } = task
        //主题
        const Theme = themes[themeId]
        const selected = {
            color: '#FFF',
            borderColor: Theme.themeColor,
            backgroundColor: Theme.themeColor,
        }
        const popStyle = { fontSize: 16, padding: 6, color: Theme.themeColor }
        const progressNum = wordCount == undefined ? 0 : (curIndex + 1) / wordCount

        return (
            //  底部控制
            <View style={{ width: width, height: 160, paddingBottom: 10 }}>
                <Grid >
                    {/* 功能按钮 */}
                    <Row style={[gstyles.r_between, { paddingHorizontal: 22 }]}>
                        {/* 英文单词按钮 */}

                        <Text style={[styles.textIcon, showWord ? selected : styles.unSelected]}
                            onStartShouldSetResponder={() => true}
                            onResponderRelease={(e) => { this._toggleWord() }}>
                            英
                    </Text>

                        {/* 中文按钮 */}
                        <Text style={[styles.textIcon, showTran ? selected : styles.unSelected]}
                            onStartShouldSetResponder={() => true}
                            onResponderRelease={(e) => { this._toggleTran() }}>
                            中
                    </Text>
                    </Row>
                    {/* 进度条 */}
                    <View style={[gstyles.r_center, { marginBottom: 10 }]}>
                        <Text style={{ color: '#fff', marginRight: 5 }}>{wordCount == 0 ? 0 : curIndex + 1}</Text>
                        <Progress.Bar
                            progress={wordCount == 0 ? 0 : progressNum}
                            height={2}
                            width={width - 100}
                            color={Theme.themeColor}
                            unfilledColor='#DEDEDE'
                            borderWidth={0} />
                        <Text style={{ color: '#fff', marginLeft: 10 }}>{wordCount}</Text>
                    </View>
                    {/*  */}
                    <Row style={[{
                        paddingHorizontal: 30,
                        marginBottom: 10,
                    }, gstyles.r_around]}>
                        {/* 查词 */}
                        <AliIcon name='chazhao' size={24} color='#FFF' onPress={() => {
                            this._pause()
                            this.props.navigation.navigate('VocaSearch');
                        }} />
                        {/* 控制播放 */}
                        <View style={[{ width: width * (1 / 2) }, gstyles.r_around]}>
                            <TouchableWithoutFeedback onPress={this._togglePlay}>
                                <View style={[styles.bigRoundBtn, { paddingLeft: autoPlayTimer ? 0 : 5 }, { backgroundColor: Theme.themeColor }]}>
                                    <AliIcon name={autoPlayTimer ? 'zanting1' : 'play'} size={22} color='#FFF'></AliIcon>
                                </View>
                            </TouchableWithoutFeedback>

                        </View>
                        {/* 控制间隔 */}
                        <Menu onSelect={this._chooseInterval} renderer={renderers.Popover} rendererProps={{ placement: 'top' }}>
                            <MenuTrigger
                                text={Math.floor(interval) + 's'}
                                customStyles={{ triggerText: styles.studyIntervalButton }} />
                            <MenuOptions>
                                <MenuOption style={gstyles.haireBottom} value={10.0}>
                                    <Text style={popStyle}>10s</Text>
                                </MenuOption>
                                <MenuOption style={gstyles.haireBottom} value={8.0}>
                                    <Text style={popStyle}>8.0s</Text>
                                </MenuOption>
                                <MenuOption style={gstyles.haireBottom} value={6.0}>
                                    <Text style={popStyle}>6.0s</Text>
                                </MenuOption>
                                <MenuOption style={gstyles.haireBottom} value={3.0}>
                                    <Text style={popStyle}>3.0s</Text>
                                </MenuOption>
                                <MenuOption style={gstyles.haireBottom} value={2.0}>
                                    <Text style={popStyle}>2.0s</Text>
                                </MenuOption>
                                <MenuOption value={1.4}>
                                    <Text style={popStyle}>1.0s</Text>
                                </MenuOption>

                            </MenuOptions>
                        </Menu>

                    </Row>

                </Grid>

            </View>

        );
    }
}


StudyPlayController.propTypes = {

    playState: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    autoplay: PropTypes.func.isRequired,
    finishedTimes: PropTypes.number.isRequired,
    changePlayTimer: PropTypes.func.isRequired,
    changeInterval: PropTypes.func.isRequired,
    toggleWord: PropTypes.func.isRequired,
    toggleTran: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired

}

StudyPlayController.defaultProps = {
}