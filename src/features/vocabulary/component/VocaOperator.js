import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import AliIcon from '../../../component/AliIcon'
import VocaGroupService from '../service/VocaGroupService'
import gstyles from "../../../style";
import { FILE_ROOT_DIR } from "../../../common/constant";
import DictDao from "../service/DictDao";
import { TYPE_ERR_CODE_VOCA } from "../common/constant";
import ErrorTemplate from "../../../component/ErrorTemplate";
import DownloadTemplate from "../../../component/DownloadTemplate";

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
        marginBottom: 3,
        marginRight: 18,
    },
    checkDot: {
        margin: 0,
        padding: 0,
    },

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
            enPhonetic: wordInfo.en_phonetic ? wordInfo.en_phonetic : wordInfo.phonetic,
            enPronUrl: wordInfo.en_pron_url ? wordInfo.en_pron_url : wordInfo.pron_url,
            amPhonetic: wordInfo.am_phonetic ? wordInfo.am_phonetic : wordInfo.phonetic,
            amPronUrl: wordInfo.am_pron_url ? wordInfo.am_pron_url : wordInfo.pron_url,
            translation: wordInfo.translation
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


    _openDict = async () => {
        let isDictdownloaded = false
        try {
            isDictdownloaded = await Storage.load({
                key: 'dictDownloaded'
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
                //开始下载
                DownloadTemplate.show({
                    commonModal: this.props.app.commonModal,
                    title: '离线词典下载中...(150M)',
                    modalHeight: 240,
                    primaryDir: FILE_ROOT_DIR,
                    filePath: '/resources/dict.zip',
                    onUnzipPress: () => {
                        this.props.app.toast.show('解压中...请稍等几秒钟', 2000)
                    },
                    onFinishPress: () => {
                        Storage.save({
                            key: 'dictDownloaded',
                            data: true
                        })
                        DictDao.getInstance().open()
                    }
                })
            })
        }
    }




    render() {


        return <View style={gstyles.r_end}>
            <TouchableOpacity onPress={() => {
                ErrorTemplate.show({
                    commonModal: this.props.app.commonModal,
                    title: this.props.wordInfo.word,
                    modalHeight: 400,
                    errorTypes: ["单词或音标", "英英释义或普通例句", "中文释义", "影视例句"],
                    params: {
                        userId: this.props.mine.user._id,
                        type: TYPE_ERR_CODE_VOCA,
                        object: this.props.wordInfo.word,
                    },
                    onSucceed: () => {
                        this.props.app.toast.show("提交成功", 1000)
                    }
                })
            }}>
                <Text style={styles.errBtn}>报错</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._openDict}>
                <Text style={styles.dictBtn}>
                    词典
                </Text>
            </TouchableOpacity>
            {this.state.added && //从生词本移除
                <AliIcon name='pingfen' size={22} color={gstyles.secColor}
                    style={{ marginRight: 12 }}
                    onPress={this._removeWord} />
            }
            {!this.state.added && //添加到生词本
                <AliIcon name='malingshuxiangmuicon-' size={22} color='#888'
                    style={{ marginRight: 12 }}
                    onPress={this._addWord} />
            }

        </View>
    }
}


const mapStateToProps = state => ({
    app: state.app,
    mine: state.mine,
});

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(VocaOperator)