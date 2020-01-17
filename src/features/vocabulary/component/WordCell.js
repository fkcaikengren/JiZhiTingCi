import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../VocaListStyle";
import gstyles from "../../../style";
import { CheckBox } from "react-native-elements";
import VocaDao from "../service/VocaDao";
import AudioService from "../../../common/AudioService";
import * as CConstant from "../../../common/constant";
import TogglePane from "./TogglePane";
import AliIcon from "../../../component/AliIcon";


export default class WordCell extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { item, onEdit, index, } = this.props

        // console.log('----------cell---'+index)
        // console.log(item === nextProps.item)
        if (item === nextProps.item && onEdit === nextProps.onEdit) {
            // console.log('false ----'+index)
            return false
        } else {
            // console.log('true ----'+index)
            return true
        }
    }

    _select = () => {
        this.props.selectItem(this.props.index)
    }

    render() {
        // console.log('-cell------rerender-')
        const { item, onEdit, index } = this.props

        if (item.isHeader) {
            return (
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>{item.title}</Text>
                </View>
            );
        } else {
            return (
                <View style={[gstyles.r_start, styles.item]}>
                    <View style={[styles.itemLeft]}>
                        {onEdit &&
                            <CheckBox
                                containerStyle={styles.checkBox}
                                onPress={this._select}
                                checked={item.checked}
                                iconType='ionicon'
                                checkedIcon='ios-checkmark-circle'
                                uncheckedIcon='ios-radio-button-off'
                                checkedColor={gstyles.secColor}
                            />
                        }
                        <TouchableOpacity activeOpacity={0.6} onPress={() => {
                            const wi = VocaDao.getInstance().lookWordInfo(item.content.word)
                            AudioService.getInstance().playSound({
                                pDir: CConstant.VOCABULARY_DIR,
                                fPath: wi.am_pron_url
                            })
                        }}>
                            <Text style={[styles.word, { marginLeft: onEdit ? 0 : 10 }]}>
                                {item.content.word}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemCenter}>
                        <TogglePane word={item.content.word} />
                    </View>
                    <View style={{ flex: 1 }} >
                        <AliIcon name='youjiantou' size={26} color='#C9C9C9' style={{ paddingLeft: 10 }} onPress={() => {
                            this.props.lookDetail(index)
                        }} />
                    </View>
                </View>

            );
        }
    }
}