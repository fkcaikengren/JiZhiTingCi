import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Grid, Col, Row, } from 'react-native-easy-grid'
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from "rn-fetch-blob";

import NotificationManage from '../../../modules/NotificationManage'
import * as Progress from '../../../component/react-native-progress';
import AliIcon from '../../../component/AliIcon'
import styles from '../VocaPlayStyle'
import gstyles from '../../../style';


const fs = RNFetchBlob.fs
const DocumentDir = fs.dirs.DocumentDir + '/'
const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');

export default class PlayController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //blur的变化，不引起重绘
        if (nextProps.vocaPlay.showBlur === !this.props.vocaPlay.showBlur) {
            return false
        }

        return true
    }


    //选择测试
    _chooseTest = (value) => {



        const { navigate } = this.props.navigation
        const { task } = this.props.vocaPlay
        const testTask = { ...task, curIndex: 0 }
        //如果没有列表单词，则提示
        if (task.words && task.words.length > 0 && task.wordCount > 0) {
            this._pause()
            switch (value) {
                case 0: //中义选词测试
                    navigate('TestTranVoca', { task: testTask, mode: 'normal', isRetest: false })
                    break;
                case 1: //例句选词测试
                    navigate('TestSenVoca', { task: testTask, mode: 'normal', isRetest: false })
                    break;
                case 2: //词选中义测试
                    navigate('TestVocaTran', { task: testTask, mode: 'normal', isRetest: false })
                    break;
                case 3: //听音选义测试
                    navigate('TestPronTran', { task: testTask, mode: 'normal', isRetest: false })
                    break;
            }
        } else {
            this.props.toastRef.show('没有单词可以测试')
        }

    }

    //选择主题
    _chooseBgOption = (value) => {
        switch (value) {
            case 0:
                this.props.navigation.navigate('BgSelector')
                break
            case 1:
                const options = {
                    title: '选择图片',
                    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
                    storageOptions: {
                        skipBackup: true,
                        path: 'images',
                    },
                };
                ImagePicker.launchImageLibrary(options, (response) => {
                    //保存到本地，设置地址
                    const bgPath = DocumentDir + 'bg/' + response.fileName
                    console.log('从相册中设置背景图片，拷贝')
                    console.log(bgPath)
                    RNFetchBlob.fs.writeFile(bgPath, response.data, 'base64')
                        .then(() => {
                            console.log('拷贝相册图片到app成功')
                            this.props.changeBg(bgPath)
                        })
                        .catch(() => {
                            console.log('拷贝失败')
                        })
                });
                break
        }

    }

    //选择播放时间间隔
    _chooseInterval = (interval) => {
        const { changeInterval } = this.props;
        changeInterval(interval);

    }

    _pause = () => {
        const { autoPlayTimer, task, curIndex } = this.props.vocaPlay;
        const { changePlayTimer } = this.props;
        if (autoPlayTimer) {
            //暂停
            clearTimeout(autoPlayTimer);
            changePlayTimer(0);
            NotificationManage.pause((e) => {
                console.log(e)
            }, () => null);

        }
    }

    //播放暂停切换
    _togglePlay = () => {
        const { autoPlayTimer, task, curIndex } = this.props.vocaPlay;
        const { changePlayTimer } = this.props;
        if (autoPlayTimer) {
            //暂停
            clearTimeout(autoPlayTimer);
            changePlayTimer(0);
            NotificationManage.pause((e) => {
                console.log(e)
            }, () => null);

        } else {
            //播放
            this.props.autoplay(curIndex);
            NotificationManage.play((e) => {
                console.log(e)
            }, () => null);
        }
    }


    render() {

        const { task, themes, themeId, autoPlayTimer, showWord, showTran, interval, curIndex } = this.props.vocaPlay;
        const { words, wordCount } = task
        const { toggleWord, toggleTran, } = this.props;
        //主题
        const Theme = themes[themeId]
        const selected = {
            color: '#FFF',
            borderColor: Theme.themeColor,
            backgroundColor: Theme.themeColor,
        }
        const progressNum = wordCount == undefined ? 0 : (curIndex + 1) / wordCount
        const popStyle = { fontSize: 16, padding: 6, color: Theme.themeColor }
        return (
            //  底部控制
            <Grid style={{ width: width, position: 'absolute', bottom: 0 }}>
                {/* 功能按钮 */}
                <Row style={[{ marginHorizontal: 10, marginBottom: 10 }, gstyles.r_around]}>
                    {/* 英文单词按钮 */}
                    <Text style={[styles.textIcon, showWord ? selected : styles.unSelected]}
                        onStartShouldSetResponder={() => true}
                        onResponderStart={(e) => { toggleWord() }}
                    >en</Text>
                    {/* 测试按钮 */}
                    <Menu onSelect={this._chooseTest} renderer={renderers.Popover} rendererProps={{ placement: 'top' }}>
                        <MenuTrigger text='测试' customStyles={{ triggerText: styles.triggerText, }} />
                        <MenuOptions>
                            <MenuOption style={gstyles.haireBottom} value={0}  >
                                <Text style={popStyle}>中义选词测试</Text>
                            </MenuOption>
                            <MenuOption style={gstyles.haireBottom} value={1}>
                                <Text style={popStyle}>例句选词测试</Text>
                            </MenuOption>
                            <MenuOption style={gstyles.haireBottom} value={2}>
                                <Text style={popStyle}>词选中义测试</Text>
                            </MenuOption>
                            <MenuOption value={3}>
                                <Text style={popStyle}>听音选义测试</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                    {/* 主题按钮 */}

                    <Menu onSelect={this._chooseBgOption} renderer={renderers.Popover} rendererProps={{ placement: 'top' }}>
                        <MenuTrigger text={'背景'} customStyles={{ triggerText: styles.triggerText, }} />
                        <MenuOptions>
                            <MenuOption value={0} style={gstyles.haireBottom} >
                                <Text style={popStyle}>选择背景图片</Text>
                            </MenuOption>
                            <MenuOption value={1}  >
                                <Text style={popStyle}>从手机相册中选择</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                    {/* 中文按钮 */}
                    <Text style={[styles.textIcon, showTran ? selected : styles.unSelected]}
                        onStartShouldSetResponder={() => true}
                        onResponderStart={(e) => { toggleTran() }}
                    >zh</Text>
                </Row>

                {/* 进度条 */}
                <Row style={[{ marginBottom: 5 }, gstyles.r_center]}>
                    <View style={gstyles.r_center}>
                        <Text style={{ color: '#fff', marginRight: 5 }}>{(wordCount == 0 || wordCount == undefined) ? 0 : curIndex + 1}</Text>
                        <Progress.Bar
                            progress={wordCount == 0 ? 0 : progressNum}  //
                            height={2}
                            width={width - 100}
                            color={Theme.themeColor}
                            unfilledColor='#DEDEDE'
                            borderWidth={0} />
                        <Text style={{ color: '#fff', marginLeft: 10 }}>{wordCount}</Text>
                    </View>
                </Row>

                {/* 播放按钮 */}
                <Row style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    paddingHorizontal: 14,
                    marginBottom: 10,
                }}>
                    <Menu onSelect={this._chooseInterval} renderer={renderers.Popover} rendererProps={{ placement: 'top' }}>
                        <MenuTrigger text={Math.floor(interval) + 's'} customStyles={{ triggerText: styles.intervalButton, }} />
                        <MenuOptions>
                            <MenuOption style={gstyles.haireBottom} value={4.0}>
                                <Text style={popStyle}>4.0s</Text>
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
                    <View style={[{ width: width * (1 / 2) + 30 }, gstyles.r_around]}>
                        <TouchableWithoutFeedback >
                            <View style={[styles.smallRoundBtn, { backgroundColor: Theme.themeColor }]}>
                                <AliIcon name='SanMiAppoutlinei1' size={20} color='#FFF'></AliIcon>
                            </View>
                        </TouchableWithoutFeedback>


                        <TouchableWithoutFeedback onPress={this._togglePlay}>
                            <View style={[styles.bigRoundBtn, { paddingLeft: autoPlayTimer ? 0 : 5 }, { backgroundColor: Theme.themeColor }]}>
                                <AliIcon name={autoPlayTimer ? 'zanting1' : 'play'} size={22} color='#FFF'></AliIcon>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback  >
                            <View style={[styles.smallRoundBtn, { backgroundColor: Theme.themeColor }]}>
                                <AliIcon name='SanMiAppoutlinei' size={20} color='#FFF'></AliIcon>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.props.openTaskListModal}>
                        <AliIcon name='bofangliebiaoicon' size={20} color='#FFF'></AliIcon>
                    </TouchableOpacity>
                </Row>

            </Grid>

        );
    }
}