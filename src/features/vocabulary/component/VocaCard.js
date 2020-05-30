import React, { Component } from 'react';
import { Dimensions, StyleSheet, ScrollView, View, Text, TouchableWithoutFeedback } from 'react-native';
import { PropTypes } from 'prop-types';
import { Grid, Row, Col } from 'react-native-easy-grid'
import Swiper from 'react-native-swiper'

import gstyles from '../../../style'
import AliIcon from '../../../component/AliIcon'
import ExampleCarousel from './ExampleCarousel'
import VocaOperator from './VocaOperator'
import AudioService from '../../../common/AudioService';
import * as CConstant from "../../../common/constant";
import { store } from '../../../redux/store';
import VocaDao from '../service/VocaDao';

const { width, height } = Dimensions.get('window');


export default class VocaCard extends Component {

    constructor(props) {
        super(props)
        this.audioService = AudioService.getInstance()
        this.curIndex = 0
        const { wordInfo } = this.props
        if (wordInfo.word && !wordInfo.isPhrase) {
            this.phrases = VocaDao.getInstance().getPhrasesOfWord(wordInfo.word, 5)
        } else {
            this.phrases = []
        }
        console.disableYellowBox = true
    }

    componentDidMount() {
        const { wordInfo, playWord, playSentence } = this.props

        //自动发音
        if (playWord) {
            this.audioService.playSound({
                pDir: CConstant.VOCABULARY_DIR,
                fPath: wordInfo.pron_url
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
            return false
        } else {

            // 短语轮播下标
            if (this._swiper && this.curIndex !== 0) {
                this._swiper.scrollBy(0 - this.curIndex, false)
            }
            // 刷新短语
            if (nextProps.wordInfo.word && !nextProps.wordInfo.isPhrase) {
                this.phrases = VocaDao.getInstance().getPhrasesOfWord(nextProps.wordInfo.word, 6)
            }

            // 滑动到顶端
            if (this._scroller) {
                this._scroller.scrollTo({ x: 0, y: 0, duration: 10 })
            }

            if (playWord) {
                this.audioService.playSound({
                    pDir: CConstant.VOCABULARY_DIR,
                    fPath: nextProps.wordInfo.pron_url
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

    _genTrans = (wordInfo) => {
        const { trans, translation } = wordInfo

        const comps = []
        if (trans) {
            for (let k in trans)
                comps.push(<View key={k.toString()} style={[gstyles.r_start, { width: width - 80 }]}>
                    <Text numberOfLines={1} style={[{ width: 40 }, gstyles.md_black]}>{k + '.'}</Text>
                    <Text numberOfLines={1} style={gstyles.md_black}>{trans[k]}</Text>
                </View>)
            return comps
        } else {
            return <Text numberOfLines={1} style={gstyles.md_black}>{translation}</Text>
        }
    }



    render() {
        const { wordInfo } = this.props
        hasEnAmPhonetic = (wordInfo.en_phonetic !== null || wordInfo.am_phonetic !== null)
        let sentence = null
        if (wordInfo.sentence && wordInfo.sentence !== '') {
            const s = wordInfo.sentence.split(/<em>|<\/em>/)
            sentence = s.map((text, index) => {
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
        const { configShowNTrans } = store.getState().mine

        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#F9F9F9' }}
                ref={ref => this._scroller = ref}
                pagingEnabled={false}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <Grid style={styles.grid}>
                    <Col>
                        {/* 单词基本信息 */}
                        <Col style={styles.basic}>
                            {/* 单词 */}
                            <Row style={gstyles.r_start}>
                                <Text style={[gstyles.xl_black_bold, { flex: 7 }]}>{wordInfo.word}</Text>
                                <View style={[{ flex: 3 }, gstyles.r_end]}>
                                    <VocaOperator showDict={!wordInfo.isPhrase} wordInfo={wordInfo} navigation={this.props.navigation} />
                                </View>
                            </Row>
                            {/* 音标 */}
                            {hasEnAmPhonetic &&
                                <Row style={[gstyles.r_start, { flexWrap: 'wrap' }]}>
                                    {wordInfo.en_phonetic &&
                                        <View style={[gstyles.r_start, { marginRight: 10 }]}>
                                            <Text style={styles.grayFont}>英</Text>
                                            <Text style={styles.grayFont}>{wordInfo.en_phonetic}</Text>
                                            <AliIcon name='shengyin' size={26} color={'#FA6360'} style={{ marginLeft: 10 }} onPress={() => {
                                                this.audioService.playSound({
                                                    pDir: CConstant.VOCABULARY_DIR,
                                                    fPath: wordInfo.en_pron_url
                                                })
                                            }} />
                                        </View>
                                    }
                                    {wordInfo.am_phonetic &&
                                        <View style={[gstyles.r_start]}>
                                            <Text style={styles.grayFont}>美</Text>
                                            <Text style={styles.grayFont}>{wordInfo.am_phonetic}</Text>
                                            <AliIcon name='shengyin' size={26} color={'#4693DB'} style={{ marginLeft: 10 }} onPress={() => {
                                                this.audioService.playSound({
                                                    pDir: CConstant.VOCABULARY_DIR,
                                                    fPath: wordInfo.am_pron_url
                                                })
                                            }} />
                                        </View>
                                    }
                                </Row>
                            }
                            {!hasEnAmPhonetic && wordInfo.phonetic &&
                                <Row style={[gstyles.r_start,]}>
                                    <Text style={styles.grayFont}>{wordInfo.phonetic.replace(/\//g, " ")}</Text>
                                    <AliIcon name='shengyin' size={26} color={gstyles.secColor} style={{ marginLeft: 10 }} onPress={() => {
                                        this.audioService.playSound({
                                            pDir: CConstant.VOCABULARY_DIR,
                                            fPath: wordInfo.pron_url
                                        })
                                    }} />
                                </Row>
                            }
                            {/* 释义 */}
                            <Col style={[gstyles.c_start_left, styles.marginTop]}>
                                <Text style={[styles.grayFont, { marginBottom: 3 }]}>[释义]</Text>
                                {
                                    this._genTrans(wordInfo)
                                }
                            </Col>
                            {/* 例句 */}
                            {sentence &&
                                <Col style={styles.marginTop}>
                                    <Text style={styles.grayFont}>[例句]</Text>
                                    <Row style={[gstyles.r_start_top]}>
                                        <Text style={[gstyles.lg_black, { flex: 10 }]}>{sentence}</Text>
                                        <AliIcon name='shengyin' size={26} color={gstyles.secColor} style={{ flex: 1, marginLeft: 10 }} onPress={() => {
                                            this.audioService.playSound({
                                                pDir: CConstant.VOCABULARY_DIR,
                                                fPath: wordInfo.sen_pron_url
                                            })
                                        }} />
                                    </Row>
                                    <Row style={[gstyles.r_start_top,]}>
                                        <Text style={[styles.grayFont, { flex: 10 }]}>{configShowNTrans ? wordInfo.sen_tran : null}</Text>
                                    </Row>
                                </Col>
                            }


                        </Col>

                        {/* 场景例句 */}
                        {wordInfo.examples && wordInfo.examples.length > 0 &&
                            <Col style={styles.carousel}>
                                <ExampleCarousel lookWord={this.props.lookWord} examples={wordInfo.examples} />
                            </Col>
                        }

                        {/* 短语和英英释义 */}
                        {this.phrases.length > 0 &&
                            <Col style={styles.basic}>
                                <Swiper
                                    ref={ref => this._swiper = ref}
                                    style={styles.wrapper}
                                    loop={false}
                                    loadMinimal
                                    loadMinimalSize={1}
                                    paginationStyle={styles.dotPosition}
                                    dotColor='#ACACAC'
                                    activeDotColor={gstyles.secColor}
                                    onIndexChanged={(i) => {
                                        this.curIndex = i
                                    }}
                                >
                                    {/* 短语 */}
                                    <Col key={"1"} >
                                        <Text style={[styles.grayFont, { marginBottom: 10 }]}>[短语]</Text>
                                        {this.phrases.length > 0 &&
                                            this.phrases.map((item, i) => {
                                                return <View style={{ height: 50 }}>
                                                    <View style={[gstyles.r_start_top]}>
                                                        <Text style={gstyles.md_black}>{item.phrase}</Text>
                                                        <AliIcon name='shengyin' size={26} color={gstyles.secColor} style={{ marginLeft: 10 }} onPress={() => {
                                                            this.audioService.playSound({
                                                                pDir: CConstant.VOCABULARY_DIR,
                                                                fPath: item.pron_url
                                                            })
                                                        }} />
                                                    </View>
                                                    <Text style={[gstyles.md_black, { position: 'absolute', top: 22, left: 1 }]}>{item.tran}</Text>
                                                </View>
                                            })
                                        }{this.phrases.length <= 0 &&
                                            <Text style={gstyles.md_black}> 无</Text>
                                        }
                                    </Col>
                                    {/* 英英释义 */}
                                    <Col key={"2"} >
                                        <Text style={[styles.grayFont, { marginBottom: 10 }]}>[英英释义]</Text>
                                        {wordInfo.def !== null && wordInfo.def !== '' &&
                                            <View style={[gstyles.r_start, { paddingRight: 10 }]}>
                                                <Text style={gstyles.md_black}>{wordInfo.def}</Text>
                                            </View>
                                        }
                                    </Col>
                                </Swiper>
                            </Col>
                        }
                        {!wordInfo.isPhrase && this.phrases.length <= 0 &&
                            <Col style={styles.basic}>
                                <Text style={[styles.grayFont, { marginBottom: 10 }]}>[英英释义]</Text>
                                {wordInfo.def !== null && wordInfo.def !== '' &&
                                    <View style={[gstyles.r_start, { paddingRight: 10 }]}>
                                        <Text style={gstyles.md_black}>{wordInfo.def}</Text>
                                    </View>
                                }
                            </Col>
                        }

                    </Col>
                </Grid>

            </ScrollView>

        )
    }
}


VocaCard.propTypes = {
    wordInfo: PropTypes.object.isRequired,
    lookWord: PropTypes.func,
    playWord: PropTypes.bool,
    playSentence: PropTypes.bool,

}

VocaCard.defaultProps = {
    lookWord: (word) => null,
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
        marginBottom: 20
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

    wrapper: {
        width: width - 20,
        height: 290
    },
    dotPosition: {
        position: 'absolute',
        top: 5,
        right: 5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    }
})
