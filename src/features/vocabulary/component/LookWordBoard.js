import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { PropTypes } from 'prop-types';
import Modal from 'react-native-modalbox'

import VocaDao from '../service/VocaDao'
import gstyles from "../../../style";
import AliIcon from '../../../component/AliIcon'
import VocaOperator from './VocaOperator'
import AudioService from "../../../common/AudioService";
import * as CConstant from "../../../common/constant";
const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');

export default class LookWordBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            wordInfo: null,
        }
        this.vocaDao = VocaDao.getInstance()
        this.audioService = AudioService.getInstance()
    }

    lookWord = (text) => {
        const reg = /[a-z]+[\-’]?[a-z]*/i
        const res = text.match(reg)

        if (res[0]) {
            const wordInfo = this.vocaDao.lookWordInfo(res[0])
            if (wordInfo) {
                //判断是否存在
                this.setState({ isOpen: true, wordInfo })
                this.props.onStateChange(true)
                return true
            }
        }
        const notFoundWordInfo = {
            word: res[0] ? res[0] : ''
        }
        this.setState({ isOpen: true, wordInfo: notFoundWordInfo })
        this.props.onStateChange(true)
        return false
    }



    _closeWordBoard = () => {
        this.setState({ isOpen: false })
        this.props.onStateChange(false)
    }

    _openWordBoard = () => {
        this.setState({ isOpen: true })
        this.props.onStateChange(true)
    }

    _genTrans = (trans) => {

        const comps = []
        if (trans) {
            for (let k in trans)
                comps.push(<View style={[gstyles.r_start, { width: width - 70 }]}>
                    <Text numberOfLines={1} style={[{ width: 40, lineHeight: 22 }, gstyles.md_black]}>{k + '.'}</Text>
                    <Text numberOfLines={1} style={[gstyles.md_black, { lineHeight: 22 }]}>{trans[k]}</Text>
                </View>)
        }
        return comps
    }


    _renderContent = () => {
        const { wordInfo } = this.state
        if (wordInfo
            && wordInfo.word
            && wordInfo.translation
            && wordInfo.translation !== ''
        ) {
            return <View style={[gstyles.c_start, styles.content]}>
                {/*单词*/}
                <View style={[{ width: '100%' }, gstyles.r_between]}>
                    <Text style={gstyles.xl_black_bold}>{wordInfo.word}</Text>
                    <VocaOperator wordInfo={wordInfo} navigation={this.props.navigation} />
                </View>
                {/*y音标*/}
                <View style={[{ width: '100%', marginTop: 10 }, gstyles.r_start]}>
                    {wordInfo.am_phonetic &&
                        <View style={gstyles.r_start}>
                            <Text style={gstyles.sm_gray}>美</Text>
                            <Text style={gstyles.sm_gray}>{wordInfo.am_phonetic}</Text>
                            <AliIcon name='shengyin' size={24} color={gstyles.secColor} style={{ marginLeft: 6 }} onPress={() => {
                                this.audioService.playSound({
                                    pDir: CConstant.VOCABULARY_DIR,
                                    fPath: wordInfo.am_pron_url
                                })
                            }} />
                        </View>
                    }
                    {wordInfo.en_phonetic &&
                        <View style={gstyles.r_start}>
                            <Text style={[gstyles.sm_gray, { marginLeft: 10 }]}>英</Text>
                            <Text style={gstyles.sm_gray}>{wordInfo.en_phonetic}</Text>
                            <AliIcon name='shengyin' size={24} color={gstyles.secColor} style={{ marginLeft: 6 }} onPress={() => {
                                this.audioService.playSound({
                                    pDir: CConstant.VOCABULARY_DIR,
                                    fPath: wordInfo.en_pron_url
                                })

                            }} />
                        </View>
                    }
                </View>
                {/*  释义*/}
                <View style={{ width: '100%', marginTop: 10 }}>
                    {
                        this._genTrans(wordInfo.trans)
                    }
                </View>
            </View>
        } else {
            return <View style={[gstyles.c_start, styles.content]}>
                <AliIcon name={'no-data'} size={50} color='#555' style={{ marginTop: 25 }} />
                <Text style={{ fontSize: 16, color: '#555', marginTop: 10 }}>sorry，没找到{wordInfo.word}</Text>
            </View>
        }

    }

    render() {
        return <Modal style={styles.modal}
            isOpen={this.state.isOpen}
            onClosed={this._closeWordBoard}
            onOpened={this._openWordBoard}
            backdrop={true}
            backdropPressToClose={true}
            swipeToClose={false}
            position={"bottom"}
            ref={comp => {
                this.wordBoard = comp
            }}>
            <View style={[{ flex: 1 }, gstyles.c_start]}>
                <View style={[gstyles.r_center, styles.dropBar]}>
                    <Text style={gstyles.lg_black}>释义  </Text>
                    <AliIcon name={'cha'} color={'#555'} size={16} style={{ position: 'absolute', right: 20 }}
                        onPress={this._closeWordBoard} />
                </View>
                {this.state.wordInfo &&
                    this._renderContent()
                }
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    modal: {
        height: 240,
        backgroundColor: "#FDFDFD",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    content: {
        width: width,
        padding: 15,

    },

    dropBar: {
        width: width,
        height: 45,
        borderBottomColor: '#AAA',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
})

LookWordBoard.propTypes = {
    navigation: PropTypes.object.isRequired,
    onStateChange: PropTypes.func,   //打开与关闭的回调

}

LookWordBoard.defaultProps = {
    onStateChange: (isOpen) => null,
}