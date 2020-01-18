import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';
import { connect } from 'react-redux'

import * as homeAction from './redux/action/homeAction'
import * as vocaPlayAction from './redux/action/vocaPlayAction'
import AliIcon from '../../component/AliIcon'
import TestPage from "./TestPage";
import * as Constant from './common/constant'
import vocaUtil from './common/vocaUtil'
import * as PlanAction from "./redux/action/planAction";

const styles = StyleSheet.create({
    content: {
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '35%'
    },
    tranFont: {
        width: '70%',
        color: '#303030',
        fontSize: 18,
        textAlign: 'center'
    },
    wrongText: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        color: '#EC6760',
        fontSize: 16,
    }
});

class TestTranVocaPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transNum: 0,
        }
        console.disableYellowBox = true
    }

    _setTransNum = (transNum) => {
        this.setState({ transNum })
    }

    _renderContent = (state) => {
        const { showWordInfos, curIndex, task } = state
        const trans = showWordInfos[curIndex] ? showWordInfos[curIndex].trans : null
        const words = vocaUtil.getNotPassedWords(task.words)
        const testWrongNum = words[curIndex] ? words[curIndex].testWrongNum : 0
        let property = null
        let translation = null
        if (trans) {
            let i = 0
            for (let k in trans) {
                if (i === this.state.transNum) {
                    property = k
                    translation = trans[k]
                    break
                }
                i++
            }
        } else {
            translation = showWordInfos[curIndex] ? showWordInfos[curIndex].translation : ''
        }
        property = property ? property + '.' : ''
        return <View style={styles.content}>
            <Text style={styles.tranFont}>
                <Text style={{ fontSize: 16 }}>{`${property}`}</Text>
                {translation}
            </Text>
            <Text style={styles.wrongText}>{`答错${testWrongNum}次`}</Text>
        </View>
    }

    render() {

        return (
            <TestPage
                {...this.props}
                mode={this.props.navigation.getParam('mode')}
                type={Constant.TRAN_WORD}
                renderContent={this._renderContent}
                setTransNum={this._setTransNum}
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
    updatePlayTask: vocaPlayAction.updatePlayTask
}


export default connect(mapStateToProps, mapDispatchToProps)(TestTranVocaPage)