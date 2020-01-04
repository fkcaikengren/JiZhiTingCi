import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'

import AliIcon from '../../../component/AliIcon'
import VocaGroupService from '../service/VocaGroupService'
import gstyles from "../../../style";
import FileService from "../../../common/FileService";
import { FILE_ROOT_DIR } from "../../../common/constant";
import * as Progress from 'react-native-progress'
import DictDao from "../service/DictDao";

const styles = StyleSheet.create({
    errBtn: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#888',
        borderRadius: 3,
        fontSize: 12,
        color: '#888',
        paddingHorizontal: 2,
        textAlign: 'center',
        marginRight: 16,
    },
    dictBtn: {
        fontSize: 14,
        color: '#888',
        borderBottomWidth: 1,
        borderColor: '#888',
        marginRight: 4,
    }
})

class VocaOperator extends Component {
    constructor(props) {
        super(props)


        this.vgService = new VocaGroupService()
        //判断
        const added = this.vgService.isExistInDefault(this.props.wordInfo.word)
        this.state = {
            added: added,
        }
    }

    _addWord = () => {
        const { wordInfo } = this.props
        const groupWord = {
            word: wordInfo.word,
            enPhonetic: wordInfo.en_phonetic,
            enPronUrl: wordInfo.en_pron_url,
            amPhonetic: wordInfo.am_phonetic,
            amPronUrl: wordInfo.am_pron_url,
            trans: wordInfo.trans
        }
        if (this.vgService.addWordToDefault(groupWord)) {
            this.setState({ added: true })
        }
    }

    _removeWord = () => {
        const word = this.props.wordInfo.word
        if (this.vgService.removeWordFromDefault(word)) {
            this.setState({ added: false })
        }
    }

    _renderProgress = (contentState) => {
        let progress = contentState.progress || 0.000
        return <View style={[{ flex: 1, width: '100%' }, gstyles.c_center]}>
            <View style={[{ flex: 1 }, gstyles.c_center]}>
                <Progress.Circle
                    size={100}
                    color={gstyles.secColor}
                    borderColor={gstyles.secColor}
                    progress={progress}
                    showsText={true}
                    textStyle={{ fontSize: 24, color: gstyles.secColor }}
                    formatText={_progress => (_progress * 100).toFixed(1) + '%'} />
                <Text style={[gstyles.md_gray, { marginTop: 15 }]}>{contentState.showText}</Text>
            </View>
            <TouchableOpacity style={{ width: '100%', }} activeOpacity={0.8} onPress={contentState.onPress}>
                <View style={[gstyles.c_center, {
                    width: '100%',
                    height: 55,
                    backgroundColor: gstyles.secColor,
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                }]}>
                    <Text style={[gstyles.md_white]}>{contentState.btnText}</Text>
                </View>
            </TouchableOpacity>

        </View >
    }


    _openDict = async () => {
        let isDictdownloaded = false
        try {
            isDictdownloaded = await Storage.load({
                key: 'dict-downloaded'
            })
        } catch (err) {
            console.log(err)
        }
        console.log(isDictdownloaded)
        //判断是否已经下载
        if (isDictdownloaded) {
            //跳转词典页面
            this.props.navigation.navigate('Dict', { word: this.props.wordInfo.word })
        } else {
            //提示是否下载词典
            this.props.app.confirmModal.show('下载离线词典？', null, () => {
                let downloadTask = null
                this.props.app.commonModal.show({
                    renderContent: this._renderProgress,
                    modalStyle: {
                        width: '70%',
                        height: 240,
                        backgroundColor: "#FFF",
                        borderRadius: 12,
                    },
                })
                this.props.app.commonModal.setContentState({
                    progress: 0,
                    showText: '离线词典下载中...(220M)',
                    btnText: '取消下载',
                    onPress: () => {
                        if (downloadTask) {
                            downloadTask.cancel(err => {
                                this.props.app.commonModal.hide()
                            })
                        }
                    }
                })
                downloadTask = new FileService().download({
                    primaryDir: FILE_ROOT_DIR,
                    filePath: '/resources/dict.zip',
                    progressFunc: (received, total) => {
                        const progress = (received / total)
                        console.log(`${received}/${total} -->`, progress)
                        this.props.app.commonModal.setContentState({
                            progress,
                        })
                        if (progress >= 1) {
                            this.props.app.commonModal.setContentState({
                                progress,
                                showText: '解压中...',
                                btnText: '请稍等',
                                onPress: () => {
                                    this.props.app.toast.show('解压中...请稍等几秒钟', 3000)
                                }
                            })
                        }
                    },
                    afterUnzip: () => {
                        this.props.app.commonModal.setContentState({
                            showText: '已完成',
                            btnText: '确定',
                            onPress: () => {
                                Storage.save({
                                    key: 'dict-downloaded',
                                    data: true
                                })
                                DictDao.getInstance().open()
                                this.props.app.commonModal.hide()
                            }
                        })

                    },
                    shouldUnzip: true,
                })
            })
        }
    }

    render() {


        return <View style={gstyles.r_end}>
            <TouchableOpacity>
                <Text style={styles.errBtn}>报错</Text>
            </TouchableOpacity>

            {this.state.added && //从生词本移除
                <AliIcon name='pingfen' size={22} color={gstyles.secColor}
                    style={{ marginRight: 16 }}
                    onPress={this._removeWord} />
            }
            {!this.state.added && //添加到生词本
                <AliIcon name='malingshuxiangmuicon-' size={22} color='#888'
                    style={{ marginRight: 16 }}
                    onPress={this._addWord} />
            }
            <TouchableOpacity onPress={this._openDict}>
                <Text style={styles.dictBtn}>
                    词典
                </Text>
            </TouchableOpacity>
        </View>
    }
}


const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(VocaOperator)