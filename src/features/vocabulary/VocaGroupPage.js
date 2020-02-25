
import React, { Component } from "react";
import {
    Platform, View, Text, TouchableNativeFeedback, TouchableOpacity, BackHandler
} from 'react-native';
import { Header } from 'react-native-elements'
import Modal from 'react-native-modalbox';
const SortableListView = require('react-native-sortable-listview');
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';

import AliIcon from '../../component/AliIcon';
import VocaGroupService from './service/VocaGroupService'
import styles from './VocaGroupStyle'
import gstyles from '../../style'
import * as VGroupAction from './redux/action/vocaGroupAction'
import * as VocaPlayAction from './redux/action/vocaPlayAction'
import { connect } from "react-redux";
import InputTemplate from "../../component/InputTemplate";
import { BY_VIRTUAL_TASK, VIRTUAL_TASK_ORDER } from "./common/constant";




class VocaGroupPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groupOrders: [],         //生词本序号
            vocaGroups: {},          //生词本
            inEdit: false,
            selectedName: '',
            refresh: true,          //用来刷新
        };
        this.vgService = new VocaGroupService()
        console.disableYellowBox = true;
    }


    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            const { commonModal, confirmModal } = this.props.app
            if (commonModal.isOpen()) {
                commonModal.hide()
            } else if (confirmModal.isOpen()) {
                confirmModal.hide()
            } else if (this.state.inEdit) {
                this.setState({ inEdit: false })
            } else {
                this._goBack()
            }
            return true
        })
        this._init()
        //提示
        this.props.app.toast.show('长按可以拖动排序', 1000)
    }

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress')
    }

    _init = () => {
        //Storage加载 groupOrders
        Storage.load({ key: 'groupOrdersString' }).then(groupOrdersData => {

            const groupOrders = JSON.parse(groupOrdersData)
            const vocaGroups = this.vgService.getAllGroups()
            this.setState({
                groupOrders,
                vocaGroups
            })

        })
    }




    _toggleEdit = () => {
        this.setState({ inEdit: !this.state.inEdit, groupOrders: [...this.state.groupOrders] })
    }

    //判断是否存在该名称的生词本
    _isNameExist = (name) => {
        let isExist = false;
        for (let i in this.state.vocaGroups) {
            if (this.state.vocaGroups[i].groupName === name) {
                isExist = true;
                break;
            }
        }
        return isExist
    }

    //添加生词本
    _addVocaGroup = async (addName) => {
        //循环
        let isExist = this._isNameExist(addName);
        //添加生词本
        if (addName === '') {
            this.props.app.toast.show('名称不能为空，添加失败', 1000);
        } else if (isExist) {
            this.props.app.toast.show('重名了，添加失败', 1000);
        } else {
            const orders = await this.vgService.addGroup(addName)
            if (orders) {
                this._refreshGroup(orders)
                this.props.app.toast.show('添加成功', 500);
            } else {
                this.props.app.toast.show('添加失败', 500);
            }
        }
    }

    //修改生词本
    _updateVocaGroup = (newName) => {
        let isExist = this._isNameExist(newName);
        //添加生词本
        if (newName === '') {
            this.props.app.toast.show('名称不能为空，修改失败', 1000);
        } else if (isExist) {
            this.props.app.toast.show('重名了，修改失败', 1000);
        } else {
            this.vgService.updateGroupName(this.state.selectedName, newName);
            this._refreshGroup()
            this.props.app.toast.show('修改成功', 500);
        }
    }

    //删除生词本
    _deleteVocaGroup = async (groupId) => {
        const orders = await this.vgService.deleteGroup(groupId)
        if (orders) {
            this._refreshGroup(orders)
            //清空vocaPlay
            if (this.props.normalType === BY_VIRTUAL_TASK && this.props.task.taskOrder !== VIRTUAL_TASK_ORDER) {
                this.props.clearPlay()
            }
            this.props.app.toast.show('删除成功', 500);
        } else {
            this.props.app.toast.show('删除失败', 500);
        }
    }

    _setDefaultGroup = (item) => {
        if (!item.isDefault) { //不是默认
            this.vgService.updateToDefault(item.id)
            this._refreshGroup([...this.state.groupOrders])
        }
    }

    // 刷新
    _refreshGroup = (groupOrders = null, shouldUpdateGroups = true) => {
        if (groupOrders) {
            if (shouldUpdateGroups) {
                const vocaGroups = this.vgService.getAllGroups()
                this.setState({
                    groupOrders, vocaGroups
                })
            } else {
                this.setState({
                    groupOrders
                })
            }

        } else {
            const vocaGroups = this.vgService.getAllGroups()
            this.setState({
                vocaGroups
            })
        }
    }

    _goBack = () => {
        this.props.syncGroup({ isByHand: false })
        this.props.navigation.goBack();
    }

    _syncByhand = () => {
        this.props.syncGroup({ isByHand: true })
    }

    _renderRow = (item) => {
        if (!item) {
            return <Text>nothing</Text>
        }
        return (
            <TouchableOpacity
                style={{ paddingVertical: 8 }}
                activeOpacity={0.8}
                disabled={this.state.inEdit}
                onPress={() => {
                    //加载生词
                    this.props.navigation.navigate('GroupVoca', {
                        groupId: item.id,
                        groupName: item.groupName,
                        refreshGroup: this._refreshGroup
                    });
                }}>
                <View style={styles.groupItem}>
                    <View style={[gstyles.r_start, { width: "100%", flex: 1, }]}>
                        <View style={styles.iconBg}>
                            <Text style={gstyles.md_black_bold}>
                                {item.groupName[0]}
                            </Text>
                        </View>
                        <View style={{ width: "100%" }}>
                            <Text numberOfLines={1} style={[{ marginLeft: 10, width: "80%" }, gstyles.lg_black]}>{item.groupName}</Text>
                            <Text style={[{ marginLeft: 10 }, gstyles.sm_gray]}>共{item.count}词</Text>
                        </View>
                    </View>
                    {!this.state.inEdit && item.isDefault &&
                        <AliIcon name='pingfen' size={26} color={gstyles.secColor} style={{ marginRight: 10 }} />
                    }
                    {this.state.inEdit &&
                        <View style={[gstyles.r_center, { flex: 1 }]}>
                            <View style={[gstyles.r_center, { flex: 1, justifyContent: 'flex-end' }]}>
                                {/* 设置为默认生词本 */}
                                <AliIcon name={item.isDefault ? 'pingfen' : 'malingshuxiangmuicon-'} color={item.isDefault ? '#F29F3F' : '#888'} size={26} onPress={() => {
                                    this._setDefaultGroup(item)
                                }} />
                                {/* 修改 */}
                                <TouchableNativeFeedback onPress={() => {
                                    this.setState({
                                        selectedName: item.groupName
                                    })
                                    InputTemplate.show({
                                        commonModal: this.props.app.commonModal,
                                        modalHeight: 160,
                                        title: '修改生词本',
                                        placeholder: item.groupName,
                                        onCancel: null,
                                        onConfirm: this._updateVocaGroup
                                    })
                                }}>
                                    <Text style={{ fontSize: 14, color: '#1890FF', marginHorizontal: 10 }}>修改名称</Text>
                                </TouchableNativeFeedback>
                                {/* 删除 */}
                                <TouchableNativeFeedback onPress={() => {
                                    if (item.isDefault) {
                                        this.props.app.toast.show('当前生词本是默认生词本，无法删除', 1500)
                                    } else {
                                        this.props.app.confirmModal.show(`删除生词本"${item.groupName}"以及其所有单词?`, null,
                                            () => { this._deleteVocaGroup(item.id) })
                                    }
                                }}>
                                    <Text style={{ fontSize: 14, color: 'red', marginRight: 10 }}>删除</Text>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    }
                </View>

            </TouchableOpacity >
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={this._goBack} />}
                    rightComponent={
                        <View style={[gstyles.r_start]}>
                            {this.state.inEdit &&
                                <TouchableOpacity activeOpacity={0.8} style={{ marginRight: 20 }} onPress={this._toggleEdit}>
                                    <Text style={gstyles.md_black}>完成</Text>
                                </TouchableOpacity>
                            }
                            <Menu renderer={renderers.Popover} rendererProps={{ placement: 'bottom' }}>
                                <MenuTrigger >
                                    <AliIcon name='add' size={26} color='#303030'></AliIcon>
                                </MenuTrigger>
                                <MenuOptions >
                                    <MenuOption onSelect={() => {
                                        InputTemplate.show({
                                            commonModal: this.props.app.commonModal,
                                            modalHeight: 160,
                                            title: '新建生词本',
                                            placeholder: '请输入生词本名称',
                                            onCancel: null,
                                            onConfirm: this._addVocaGroup
                                        })
                                    }} style={gstyles.menuOptionView}>
                                        <AliIcon name="tianjia" size={20} color="#303030" style={{ marginRight: 15 }} />
                                        <Text style={gstyles.menuOptionText}>添加</Text>
                                    </MenuOption>

                                    <MenuOption onSelect={this._toggleEdit} style={gstyles.menuOptionView}>
                                        <AliIcon name="bianji1" size={20} color="#303030" style={{ marginRight: 15 }} />
                                        <Text style={gstyles.menuOptionText}>{this.state.inEdit ? "完成" : "编辑"}</Text>
                                    </MenuOption>

                                    <MenuOption onSelect={this._syncByhand} style={[gstyles.menuOptionView, { borderBottomWidth: 0 }]} >
                                        <AliIcon name='tongbu' size={20} color="#303030" style={{ marginRight: 15 }} />
                                        <Text style={gstyles.menuOptionText}>同步</Text>
                                    </MenuOption>

                                </MenuOptions>
                            </Menu>

                        </View>
                    }
                    centerComponent={{ text: '生词本', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                {/* 生词本列表 */}
                <View style={{ flex: 1 }}>
                    <SortableListView
                        data={this.state.vocaGroups}
                        order={this.state.groupOrders}
                        onRowMoved={(e) => {
                            const orders = [...this.state.groupOrders]
                            orders.splice(e.to, 0, orders.splice(e.from, 1)[0]);
                            this.vgService.sortGroups(orders)
                            this._refreshGroup(orders, false)
                            //清空vocaPlay
                            if (this.props.normalType === BY_VIRTUAL_TASK && this.props.task.taskOrder !== VIRTUAL_TASK_ORDER) {
                                this.props.clearPlay()
                            }


                        }}
                        renderRow={this._renderRow}
                        rowHasChanged={(r1, r2) => { return r1 !== r2 }}
                    />
                </View>

            </View>
        );
    }
}


const mapStateToProps = state => ({
    app: state.app,
    task: state.vocaPlay.task,
    normalType: state.vocaPlay.normalType
});

const mapDispatchToProps = {
    syncGroup: VGroupAction.syncGroup,
    clearPlay: VocaPlayAction.clearPlay
}



export default connect(mapStateToProps, mapDispatchToProps)(VocaGroupPage)