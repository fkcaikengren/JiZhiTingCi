import React, { Component } from "react";
import { StatusBar, View, Text, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import { Header, CheckBox, Button } from 'react-native-elements'
import { sortBy } from 'lodash'
import CardView from 'react-native-cardview'
import { connect } from 'react-redux';
import BackgroundTimer from 'react-native-background-timer'

import AliIcon from '../../component/AliIcon';
import IndexSectionList from '../../component/IndexSectionList';
import VocaUtil from './common/vocaUtil'
import * as VocaPlayAction from './redux/action/vocaPlayAction'
import * as Constant from './common/constant'
import * as CConstant from '../../common/constant'

import styles from './GroupVocaStyle'
import gstyles from '../../style'
import AudioService from "../../common/AudioService";
import VocaGroupService from "./service/VocaGroupService";
import AddVocaTemplate from "./component/AddVocaTemplate";
import TogglePanel from "./component/TogglePanel";

const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = 60;         //item的高度
const HEADER_HEIGHT = 24;       //分组头部的高度
const SEPARATOR_HEIGHT = 1;     //分割线的高度

/*
    总结：禁止在react-navigation里面传递RealmObject对象， 这样对导致Realm对象留在导航里。
    当组件unMount,realm.close()时，仍然存在对RealmObject的引用，而该RealmObject却已经过期了
*/


class GroupVocaPage extends Component {
    constructor(props) {
        super(props);
        this.vgService = new VocaGroupService()
        this.audioService = AudioService.getInstance()

        this.state = {

            onEdit: false,
            checked: false,
            isSelectAll: true,
            checkedIndex: [], //选中的索引
            flatData: [],
            sideSections: [],
            sectionIndex: [],
            stickyHeaderIndices: []
        }
        // console.log(this.props.navigation.state.params.refreshGroup)
        console.disableYellowBox = true
    }

    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            const { isOpen, hide } = this.props.app.commonModal
            if (isOpen()) {
                hide()
            } else if (this.state.onEdit) {
                this.setState({
                    onEdit: false
                })
            } else {
                this.props.navigation.goBack()
            }
            return true
        })
        this._formatData()
    }

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.onEdit == true && nextState.onEdit == false) {
            //清理checked
            this._cancleCheck()
            return false
        }
        return true
    }

    _formatData = () => {          //数据预处理
        const { getParam } = this.props.navigation
        const isEnPron = (this.props.mine.configVocaPronType === Constant.VOCA_PRON_TYPE_EN)

        const groupId = getParam('groupId')
        const group = this.vgService.getGroupById(groupId)
        let sections = group.sections
        //每组的开头在列表中的位置
        let totalSize = 0;
        //FlatList的数据源
        let flatData = [];
        //分组头的数据源
        let sideSections = [];
        //分组头在列表中的位置
        let sectionIndex = [];

        //对section排序
        sections = sortBy(sections, ['section'])

        //格式化sections
        for (let i = 0; i < sections.length; i++) {        //遍历章节

            //给右侧的滚动条进行使用的
            sideSections[i] = sections[i].section,
                sectionIndex[i] = totalSize;
            //FlatList的数据
            flatData.push({
                type: 'section', section: sections[i].section,
            });
            totalSize++;
            for (let w of sections[i].words) { //遍历单词
                flatData.push({
                    type: 'word',
                    word: w.word,
                    checked: false,
                    isHidden: w.isHidden,
                    translation: w.translation,
                    phonetic: isEnPron ? w.enPhonetic : w.amPhonetic,
                    pronUrl: isEnPron ? w.enPronUrl : w.amPronUrl,
                });
                totalSize++;
            }

        }
        // console.log(sectionIndex1); [0, 8, 16, 24, 32, 37, 45, 53, 61, 69]
        this.setState({ flatData, sideSections, sectionIndex })

    }

    // 取消check
    _cancleCheck = () => {
        this.setState({ checkedIndex: [], checked: false, isSelectAll: true })
    }

    //多选
    _selectItem = (index) => {
        let checked = this.state.checked
        let checkedIndex = this.state.checkedIndex
        if (checkedIndex.includes(index)) { //取消
            checkedIndex = checkedIndex.filter((item, i) => {
                return item !== index
            })
        } else {                            //选中
            checkedIndex.push(index)
        }

        if (checkedIndex.length <= 0) {
            checked = false
        }
        //如果首次被选
        if (this.state.checked == false) {
            checked = true
        }
        this.setState({ checkedIndex, checked })
    }

    // 全选
    _selectAll = () => {
        if (this.state.isSelectAll) {

            const checkedIndex = []
            let i = 0
            for (let item of this.state.flatData) {
                if (item.type === 'word') {
                    checkedIndex.push(i)
                }
                i++
            }
            this.setState({
                checkedIndex,
                checked: true,
                isSelectAll: !this.state.isSelectAll
            })
        } else {
            this.setState({
                checkedIndex: [],
                checked: false,
                isSelectAll: !this.state.isSelectAll
            })

        }

    }


    //切换编辑状态
    _toggleEdit = () => {
        this.setState({ onEdit: !this.state.onEdit })
    }

    //批量删除单词
    _deleteWords = () => {
        //删除
        const groupId = this.props.navigation.getParam('groupId')
        const words = this.state.checkedIndex.map((itemIndex, i) => {
            return this.state.flatData[itemIndex].word
        })
        console.log(words)
        const result = this.vgService.deleteWords(groupId, words)
        if (result.success) {
            this.props.app.toast.show(`成功删除${result.deletedWords.length}个生词`, 1000);

            //刷新
            const flatData = this.state.flatData.filter((item, index) => {
                let deleted = false
                if (item.type === 'section') {
                    deleted = result.deletedSections.includes(item.section)
                }
                return !deleted && !this.state.checkedIndex.includes(index)
            })
            const sectionIndex = []  //重新计算头部索引
            for (let i in flatData) {
                if (flatData[i].type === 'section') {
                    sectionIndex.push(parseInt(i))
                }
            }
            const sideSections = this.state.sideSections.filter((item, index) => {
                return !result.deletedSections.includes(item)
            })
            this.setState({ flatData, sectionIndex, sideSections, onEdit: false })

            //刷新生词本页面数据
            this.props.navigation.state.params.refreshGroup();
        } else {
            this.props.app.toast.show('删除失败', 1000);
            //不刷新
        }
    }




    _playBtn = () => {
        const words = this.state.checkedIndex.map((itemIndex, i) => {
            return this.state.flatData[itemIndex].word
        })
        console.log(words)
        if (words.length < Constant.MIN_PLAY_NUMBER) {
            this.props.app.toast.show('当前选择不足5个，不可以播放哦', 1000)
        } else {
            const virtualTask = VocaUtil.genVirtualTask(words, '来源：生词本')
            // console.log(virtualTask)

            //暂停
            const { autoPlayTimer, } = this.props.vocaPlay
            if (autoPlayTimer) {
                BackgroundTimer.clearTimeout(autoPlayTimer);
                this.props.changePlayTimer(0);
            }

            this.props.navigation.navigate('VocaPlay', {
                task: virtualTask,
                mode: Constant.NORMAL_PLAY,
                normalType: Constant.BY_VIRTUAL_TASK,
            });
        }
    }

    _keyExtractor = (item, index) => {
        if (item.type === 'section') {
            return item.section + index
        } else {
            return item.word + index
        }
    }

    render() {
        const groupName = this.props.navigation.getParam('groupName')
        const delIconColor = this.state.checked ? gstyles.emColor : '#999'
        const playIconColor = this.state.checked ? gstyles.mainColor : '#999'
        const editBtn = this.state.onEdit ?
            <View style={gstyles.r_start}>
                <TouchableOpacity onPress={this._selectAll}>
                    <Text style={[gstyles.md_black, { marginRight: 10 }]}>{this.state.isSelectAll ? "全选" : "全不选"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={this._toggleEdit}>
                    <Text style={gstyles.md_black}>取消</Text>
                </TouchableOpacity>
            </View>
            :
            <TouchableOpacity onPress={this._toggleEdit}>
                <AliIcon name='bianji' size={24} color={gstyles.black}></AliIcon>
            </TouchableOpacity>

        return (
            <View style={styles.container}>
                <StatusBar translucent={true} />
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack()
                        }} />}
                    centerComponent={{ text: groupName, style: [gstyles.lg_black_bold, { width: '70%', textAlign: 'center' }] }}
                    rightComponent={
                        <View style={gstyles.r_start}>
                            {!this.state.onEdit &&
                                <AliIcon name='piliangtianjia' size={24} color={gstyles.black} style={{ marginRight: 15 }} onPress={() => {
                                    AddVocaTemplate.show({
                                        commonModal: this.props.app.commonModal,
                                        title: "批量添加生词",
                                        groupName: groupName,
                                        modalHeight: 400,
                                        onSucceed: () => {
                                            //刷新
                                            this._formatData()
                                            this.props.navigation.state.params.refreshGroup()
                                        }
                                    })
                                }} />
                            }
                            {
                                editBtn
                            }
                        </View>

                    }
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                {this.state.flatData.length > 0 &&
                    <View style={{ flex: 1, marginBottom: this.state.onEdit ? 60 : 0 }}>
                        <FlatList
                            ref={ref => this._list = ref}
                            data={this.state.flatData}
                            renderItem={this._renderItem}
                            extraData={this.state}
                            getItemLayout={this._getItemLayout}
                            keyExtractor={this._keyExtractor}
                            stickyHeaderIndices={this.state.sectionIndex} />
                        <IndexSectionList
                            sections={this.state.sideSections}
                            onSectionSelect={this._onSectionselect} />
                    </View>
                }
                {this.state.flatData.length <= 0 &&
                    <View style={[gstyles.c_center, { flex: 1 }]}>
                        <AliIcon name={'no-data'} size={60} color={gstyles.gray} />
                        <Text style={gstyles.md_gray}>暂无生词</Text>
                    </View>
                }
                {this.state.onEdit &&
                    <CardView
                        cardElevation={5}
                        cardMaxElevation={5}
                        cornerRadius={20}
                        style={gstyles.footer}>
                        <View style={gstyles.r_around}>
                            <Button
                                disabled={!this.state.checked}
                                type="clear"
                                icon={<AliIcon name='shanchu' size={26} color={delIconColor} />}
                                title='删除'
                                titleStyle={[gstyles.md_black_bold, { paddingBottom: 2, lineHeight: 20 }]}
                                onPress={this._deleteWords}>
                            </Button>
                            <View style={{ width: 1, height: 20, backgroundColor: '#999' }}></View>
                            <Button
                                disabled={!this.state.checked}
                                type="clear"
                                icon={<AliIcon name='Home_tv_x' size={26} color={playIconColor} />}
                                title='播放'
                                titleStyle={[gstyles.md_black_bold, { paddingBottom: 2, lineHeight: 20 }]}
                                onPress={this._playBtn}>
                            </Button>
                        </View>
                    </CardView>
                }
            </View>
        );
    }



    //这边返回的是A,0这样的数据
    _onSectionselect = (section, index) => {
        //跳转到某一项
        // console.log('=>'+index);
        this._list.scrollToIndex({ animated: false, index: this.state.sectionIndex[index], viewPosition: 0 });
    }

    //data:flatData, index: item的下标
    _getItemLayout = (data, index) => {
        let length = ITEM_HEIGHT
        if (this.state.sectionIndex.includes(index)) {
            console.log(`include --- ${index}`)
            length = HEADER_HEIGHT
        }
        //  计算几个header,设计偏移量算法
        // sectionIndex [0, 8, 16, 24, 32, 37, 45, 53, 61, 69]
        let headerCount = 0;
        for (let i in this.state.sectionIndex) {
            if (this.state.sectionIndex[i] < index) {
                headerCount++;
            } else {
                break;
            }
        }
        const offset = (index - headerCount) * (ITEM_HEIGHT + SEPARATOR_HEIGHT) + headerCount * (HEADER_HEIGHT + SEPARATOR_HEIGHT)
        console.log(`offset : ${offset}`);
        return { index, offset, length };
    }

    _renderItem = ({ item, index }) => {
        let flag = (item.type === 'section');
        const itemPaddingLeft = this.state.onEdit ? 0 : 20
        const bodyWidth = this.state.onEdit ? width - 60 : width - 40
        const itemChecked = this.state.checkedIndex.includes(index)
        let pronTypeText = ""
        if (item.word && !(item.word.includes(' ') || item.word.includes("…"))) {//非短语
            pronTypeText = (this.props.mine.configVocaPronType === Constant.VOCA_PRON_TYPE_EN) ? '英' : '美'

        }
        return (
            flag
                ? <View key={'h' + index} style={styles.headerView}>
                    <Text style={styles.headerText}>{item.section}</Text>
                </View>
                : <View style={[gstyles.r_start, styles.itemView, { paddingLeft: itemPaddingLeft }]}>
                    {this.state.onEdit &&
                        <CheckBox
                            containerStyle={styles.checkBox}
                            onPress={() => { this._selectItem(index) }}
                            checked={itemChecked}
                            iconType='ionicon'
                            checkedIcon='ios-checkmark-circle'
                            uncheckedIcon='ios-radio-button-off'
                            checkedColor={gstyles.secColor}
                        />
                    }
                    <View key={'w' + index} style={[gstyles.c_center_left, { width: bodyWidth }]}>
                        <View style={[gstyles.r_start_bottom, { width: '100%' }]}>
                            <Text style={{ fontSize: 16, color: '#303030', fontWeight: '500' }}>{item.word}</Text>
                            <Text style={{ fontSize: 12, color: '#AAA', fontWeight: '300', marginLeft: 10 }}>{`${pronTypeText} ${item.phonetic}`}</Text>

                            <AliIcon name='shengyin' size={24} color='#555'
                                style={{ position: 'absolute', top: 0, right: 0 }}
                                onPress={() => {
                                    this.audioService.playSound({
                                        pDir: CConstant.VOCABULARY_DIR,
                                        fPath: item.pronUrl
                                    })
                                }} />
                        </View>
                        {/* item.translation */}
                        <TogglePanel word={item.translation} isWord={false}
                            containerStyle={{ height: 18, marginTop: 3, marginBottom: 5 }}
                            textStyle={{ fontSize: 14, color: '#555', lineHeight: 16 }}
                        />

                    </View>
                </View>

        )

    }
}



const mapStateToProps = state => ({
    app: state.app,
    vocaPlay: state.vocaPlay,
    mine: state.mine,
});

const mapDispatchToProps = {
    changePlayTimer: VocaPlayAction.changePlayTimer,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupVocaPage);