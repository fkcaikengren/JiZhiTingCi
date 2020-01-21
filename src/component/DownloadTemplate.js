import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements'
import * as Progress from 'react-native-progress'
import gstyles from '../style';
import FileService from '../common/FileService';

/**
 * 关于CommonModal的展示模板
 */
export default class DownloadTemplate {

    static _renderProgress = ({ commonModal }) => {
        return () => {
            const {
                getContentState
            } = commonModal
            const contentState = getContentState()
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
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                    }]}>
                        <Text style={[gstyles.md_white]}>{contentState.btnText}</Text>
                    </View>
                </TouchableOpacity>

            </View >
        }
    }


    static show({
        commonModal, title, modalHeight, primaryDir, filePath, onUnzipPress, onFinishPress
    }) {
        const {
            getContentState,
            setContentState,
            show,
            hide
        } = commonModal
        let downloadTask = null
        setContentState({
            progress: 0,
            showText: title,
            btnText: '取消下载',
            onPress: () => {
                if (downloadTask) {
                    downloadTask.cancel(err => {
                        hide()
                    })
                }
            }
        })
        show({
            renderContent: this._renderProgress({ commonModal }),
            modalStyle: {
                width: '70%',
                height: modalHeight,
                backgroundColor: "#FFF",
                borderRadius: 10,
            },
        })

        downloadTask = new FileService().download({
            primaryDir: primaryDir,
            filePath: filePath,
            shouldUnzip: true,
            progressFunc: (received, total) => {
                const progress = (received / total)
                console.log(`${received}/${total} -->`, progress)
                setContentState({
                    progress,
                })
                if (progress >= 1) {
                    setContentState({
                        progress,
                        showText: '解压中...',
                        btnText: '请稍等',
                        onPress: () => {
                            if (onUnzipPress) {
                                onUnzipPress()
                            }
                        }
                    })
                }
            },
            afterUnzip: () => {
                setContentState({
                    showText: '已完成',
                    btnText: '确定',
                    onPress: () => {
                        hide()
                        if (onFinishPress) {
                            onFinishPress()
                        }


                    }
                })

            },

        })

    }
}

const styles = StyleSheet.create({

});
