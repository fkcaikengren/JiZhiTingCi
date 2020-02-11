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
import VocaUtil from "./common/vocaUtil";

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
        super(props)
        this.word = null
        this.transNum = 0
        console.disableYellowBox = true
    }


    _renderContent = (taskWord, wordInfo) => {
        const testWrongNum = taskWord.testWrongNum
        const trans = wordInfo.trans
        let property = null
        let translation = null


        if (trans) {
            let i = 0
            if (this.word != wordInfo.word) {
                this.word = wordInfo.word
                this.transNum = VocaUtil.randomNum(0, Object.keys(trans).length - 1)
            }
            for (let k in trans) {
                if (i === this.transNum) {
                    property = k
                    translation = trans[k]
                    break
                }
                i++
            }
        }
        translation = translation ? translation : wordInfo.translation
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


export default connect(mapStateToProps, mapDispatchToProps)(TestTranVocaPage)