import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback, Image } from 'react-native';
import { connect } from 'react-redux'

import * as homeAction from './redux/action/homeAction'
import * as vocaPlayAction from './redux/action/vocaPlayAction'
import AliIcon from '../../component/AliIcon'
import TestPage from "./TestPage";
import * as Constant from './common/constant'
import AudioService from '../../common/AudioService'
import * as PlanAction from "./redux/action/planAction";
import * as CConstant from "../../common/constant";
import vocaUtil from "./common/vocaUtil";

const styles = StyleSheet.create({

    content: {
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '35%'
    },
    img: {
        width: 60,
        height: 60
    },
    wrongText: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        color: '#EC6760',
        fontSize: 16,
    }
});

class TestPronTranPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false
        }
        console.disableYellowBox = true
    }


    _startPlay = () => {
        this.setState({ isPlaying: true })
    }

    _finishPlay = () => {
        setTimeout(() => {
            this.setState({ isPlaying: false })
        }, 500)
    }
    _failPlay = () => {
        this.setState({ isPlaying: false })
    }

    _playAudio = (pronUrl) => {
        // this.setState({isPlaying})
        //播放单词音频
        AudioService.getInstance().playSound({
            pDir: CConstant.VOCABULARY_DIR,
            fPath: pronUrl
        }, this._startPlay, this._finishPlay, this._failPlay)
    }

    _renderContent = (taskWord, wordInfo) => {
        const pronUrl = wordInfo.pron_url
        const testWrongNum = taskWord.testWrongNum
        return <View style={styles.content}>
            {!this.state.isPlaying &&
                <AliIcon name='shengyin' size={60} color='#F29F3F'
                    style={{ paddingTop: 3 }}
                    onPress={() => {
                        AudioService.getInstance().playSound({
                            pDir: CConstant.VOCABULARY_DIR,
                            fPath: pronUrl
                        }, this._startPlay, this._finishPlay, this._failPlay)
                    }} />
            }

            {this.state.isPlaying &&
                <TouchableWithoutFeedback onPress={() => {
                    AudioService.getInstance().playSound({
                        pDir: CConstant.VOCABULARY_DIR,
                        fPath: pronUrl
                    })
                }}>
                    <Image source={require('../../image/audio.gif')} style={styles.img} />
                </TouchableWithoutFeedback>
            }
            <Text style={styles.wrongText}>{`答错${testWrongNum}次`}</Text>
        </View>
    }

    render() {
        return (
            <TestPage
                {...this.props}
                mode={this.props.navigation.getParam('mode')}
                type={Constant.PRON_TRAN}
                renderContent={this._renderContent}
                playAudio={this._playAudio}
            />
        )
    }
}



const mapStateToProps = state => ({
    home: state.home,
    vocaPlay: state.vocaPlay
})

const mapDispatchToProps = {
    updateTask: homeAction.updateTask,
    syncTask: homeAction.syncTask,
    changeLearnedWordCount: PlanAction.changeLearnedWordCount,
    updatePlayTask: vocaPlayAction.updatePlayTask,
    changeTestTimes: vocaPlayAction.changeTestTimes
}


export default connect(mapStateToProps, mapDispatchToProps)(TestPronTranPage)