import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableWithoutFeedback } from 'react-native';
import { PropTypes } from 'prop-types';
import { Grid, Row, Col } from 'react-native-easy-grid'

import gstyles from '../../../style'
import AliIcon from '../../../component/AliIcon'
import ExampleCarousel from './ExampleCarousel'
import VocaOperator from './VocaOperator'

import VocaDao from '../service/VocaDao'
import AudioService from '../../../common/AudioService';
import * as CConstant from "../../../common/constant";


const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');

export default class VocaCard extends Component {

    constructor(props) {
        super(props)
        this.audioService = AudioService.getInstance()
        const { wordInfo } = this.props

        this.state = {
            showAll: this.props.showAll,
            wordRoot: null,
            relativeRoots: [],
        }
        console.disableYellowBox = true

    }

    componentDidMount() {
        const { wordInfo, playWord, playSentence } = this.props
        const wordRoot = VocaDao.getInstance().getWordRoot(this.props.wordInfo.root_id)
        if (wordRoot) {
            const relativeRoots = VocaDao.getInstance().getWordRoots(wordRoot.relatives, 3, true)
            this.setState({ wordRoot, relativeRoots })
        }
        //自动发音
        if (playWord) {
            this.audioService.playSound({
                pDir: CConstant.VOCABULARY_DIR,
                fPath: wordInfo.am_pron_url
            }, null, () => {
                if (playSentence) {
                    this.audioService.playSound({
                        pDir: CConstant.VOCABULARY_DIR,
                        fPath: wordInfo.sen_pron_url
                    })
                }
            }, null, false)

        } else if (playSentence) {
            this.audioService.playSound({
                pDir: CConstant.VOCABULARY_DIR,
                fPath: wordInfo.sen_pron_url
            })
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        const { wordInfo, playWord, playSentence } = this.props
        //自动发音
        if (wordInfo === nextProps.wordInfo) {
            if (this.state.showAll === nextState.showAll) {
                return false
            } else {
                return true
            }


        } else {
            if (this.props.showAll === false) {
                this.setState({ showAll: false })
            }

            if (playWord) {

                this.audioService.playSound({
                    pDir: CConstant.VOCABULARY_DIR,
                    fPath: nextProps.wordInfo.am_pron_url
                }, null, () => {
                    if (playSentence) {
                        this.audioService.playSound({
                            pDir: CConstant.VOCABULARY_DIR,
                            fPath: nextProps.wordInfo.sen_pron_url
                        })
                    }
                }, null, false)
            } else if (playSentence) {
                this.audioService.playSound({
                    pDir: CConstant.VOCABULARY_DIR,
                    fPath: nextProps.wordInfo.sen_pron_url
                })
            }
        }

        return true
    }

    _genTrans = (transStr) => {
        const trans = JSON.parse(transStr)
        const comps = []
        if (trans) {
            for (let k in trans)
                comps.push(<View key={k.toString()} style={[gstyles.r_start, { width: width - 80 }]}>
                    <Text numberOfLines={1} style={[{ width: 40 }, gstyles.md_black]}>{k + '.'}</Text>
                    <Text numberOfLines={1} style={gstyles.md_black}>{trans[k]}</Text>
                </View>)
        }
        return comps
    }


    // 点击显示
    _showAll = () => {
        this.setState({ showAll: true })
    }


    render() {
        const { wordInfo } = this.props
        let sen = ''
        if (wordInfo.sentence && wordInfo.sentence !== '') {
            const s = wordInfo.sentence.split(/<em>|<\/em>/)
            sen = s.map((text, index) => {
                if (index % 2 === 0) {
                    const words = text.split(' ')
                    return words.map((word, i) => <Text
                        key={word + index + i}
                        onStartShouldSetResponder={e => true}
                        onResponderStart={e => this.props.lookWord(word)}
                    >{word} </Text>)
                } else {
                    return <Text key={text + index} style={{ color: gstyles.emColor, }}>{text}</Text>
                }
            })
        }

        return (
            <ScrollView style={{ flex: 1 }}
                pagingEnabled={false}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: '#F9F9F9' }}
                contentContainerStyle={styles.contentContainer}
            >
                <Grid style={styles.grid}>
                    <Col>
                        {/* 单词基本信息 */}
                        <Col style={styles.basic}>
                            {/* 单词 */}
                            <Row style={gstyles.r_between}>
                                <Text style={gstyles.xl_black_bold}>{wordInfo.word}</Text>
                                <VocaOperator wordInfo={wordInfo} navigation={this.props.navigation} />
                            </Row>
                            {/* 音标 */}
                            <Row style={[gstyles.r_start,]}>
                                <Text style={styles.grayFont}>{wordInfo.am_phonetic}</Text>
                                <AliIcon name='shengyin' size={26} color={gstyles.secColor} style={{ marginLeft: 10 }} onPress={() => {
                                    this.audioService.playSound({
                                        pDir: CConstant.VOCABULARY_DIR,
                                        fPath: wordInfo.am_pron_url
                                    })
                                }} />
                            </Row>
                            {/* 英英释义 */}
                            <Row style={[gstyles.r_start, styles.marginTop]}>
                                <Text style={styles.grayFont}>{wordInfo.def}</Text>
                            </Row>
                            {/* 例句 */}
                            <Row style={[gstyles.r_start_top, styles.marginTop]}>
                                <Text style={[gstyles.lg_black, { flex: 10 }]}>{sen}</Text>
                                <AliIcon name='shengyin' size={26} color={gstyles.secColor} style={{ flex: 1, marginLeft: 10 }} onPress={() => {
                                    this.audioService.playSound({
                                        pDir: CConstant.VOCABULARY_DIR,
                                        fPath: wordInfo.sen_pron_url
                                    })
                                }} />
                            </Row>
                            {/* 释义 */}
                            {this.state.showAll &&
                                <Row style={styles.marginTop}>
                                    <Col>
                                        {
                                            this._genTrans(wordInfo.trans)
                                        }
                                    </Col>
                                </Row>
                            }
                        </Col>
                        {/* 场景例句 */}
                        {this.state.showAll && wordInfo.examples.length > 0 &&
                            <Col style={styles.carousel}>
                                <ExampleCarousel lookWord={this.props.lookWord} examples={wordInfo.examples} />
                            </Col>
                        }

                    </Col>
                </Grid>
                {!this.state.showAll &&
                    <TouchableWithoutFeedback onPress={this._showAll}>
                        <View style={styles.clickView}>
                            <Text style={styles.clickText}>点击显示</Text>
                        </View>
                    </TouchableWithoutFeedback>
                }
            </ScrollView>

        )
    }
}


VocaCard.propTypes = {
    wordInfo: PropTypes.object.isRequired,
    lookWord: PropTypes.func,
    showAll: PropTypes.bool,
    playWord: PropTypes.bool,
    playSentence: PropTypes.bool,

}

VocaCard.defaultProps = {
    lookWord: (word) => null,
    showAll: true,
    playWord: false,
    playSentence: false,

}



const styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: 16,
        backgroundColor: '#F9F9F9',
    },
    grid: {
        marginHorizontal: 10,
        backgroundColor: '#F9F9F9',
    },
    basic: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 16
    },
    carousel: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        marginBottom: 60
    },
    root: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        marginBottom: 16
    },


    grayFont: {
        color: '#505050',
        fontSize: 16,
    },
    marginTop: {
        marginTop: 10,
    },
    clickView: {
        width: '100%',
        height: height / 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clickText: {
        fontSize: 16,
        color: '#555',
    }
})
