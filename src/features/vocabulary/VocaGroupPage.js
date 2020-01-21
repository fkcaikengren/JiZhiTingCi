
import React, { Component } from "react";
import {
    View,
    Text,
    TouchableNativeFeedback,
    ScrollView,
    TextInput,
    Keyboard
} from 'react-native';
import { Header, Button } from 'react-native-elements'
import Modal from 'react-native-modalbox';
import CardView from 'react-native-cardview'

import AliIcon from '../../component/AliIcon';
import VocaGroupService from './service/VocaGroupService'
import styles from './VocaGroupStyle'
import gstyles from '../../style'
import DashSecondLine from '../../component/DashSecondLine'
import * as VGroupAction from './redux/action/vocaGroupAction'
import { connect } from "react-redux";
import InputTemplate from "../../component/InputTemplate";

const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');


class VocaGroupPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vocaGroups: [],          //生词本数组
            inEdit: false,
            selectedName: '',
            refresh: true,          //用来刷新
        };
        this.vgService = new VocaGroupService()
        console.disableYellowBox = true;
    }

    componentDidMount() {
        this._refreshGroup()
    }

    componentWillUnmount() {
    }








    _toggleEdit = () => {
        this.setState({ inEdit: !this.state.inEdit })
    }

    //判断是否存在该名称的生词本
    _isNameExist = (name) => {
        let isExist = false;
        for (let g of this.state.vocaGroups) {
            if (g.groupName === name) {
                isExist = true;
                break;
            }
        }
        return isExist
    }

    //添加生词本
    _addVocaGroup = (addName) => {
        //循环
        let isExist = this._isNameExist(addName);
        //添加生词本
        if (addName === '') {
            this.props.app.toast.show('名称不能为空，添加失败', 1000);
        } else if (isExist) {
            this.props.app.toast.show('重名了，添加失败', 1000);
        } else {
            this.vgService.addGroup(addName)
            this._refreshGroup()
            this.props.app.toast.show('添加成功', 500);
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
            this.setState({ selectedName: '' })
            this.props.app.toast.show('修改成功', 500);
        }
    }

    //删除生词本
    _deleteVocaGroup = (deleteName) => {
        //默认生词本不能删除
        if (this.vgService.isDefault(deleteName)) {
            this.props.app.toast.show('无法删除默认生词本', 1000);
        } else {
            this.vgService.deleteGroup(deleteName)
            this.props.app.toast.show('删除成功', 500);
            this.setState({ refresh: !this.state.refresh })
        }
    }

    _setDefaultGroup = (item) => {
        if (!item.isDefault) { //不是默认
            this.vgService.updateToDefault(item.groupName)
            this.setState({ refresh: !this.state.refresh })
        }
    }

    // 刷新
    _refreshGroup = () => {
        const vocaGroups = this.vgService.getAllGroups();
        this.setState({ vocaGroups })
    }

    _goBack = () => {
        this.props.syncGroup({ isByHand: false })
        this.props.navigation.goBack();
    }

    _syncByhand = () => {
        this.props.syncGroup({ isByHand: true })
    }


    render() {

        return (
            <View style={styles.container}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={this._goBack} />}
                    rightComponent={<AliIcon name='tongbu' size={24} color={gstyles.black} onPress={this._syncByhand} />}
                    centerComponent={{ text: '生词本', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                {/* 生词本列表 */}
                <View style={styles.content}>
                    <ScrollView style={{ flex: 1, paddingBottom: 40 }}
                        pagingEnabled={false}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {this.state.vocaGroups.map((item, index) => {
                            return (
                                <TouchableNativeFeedback disabled={this.state.inEdit} key={index} onPress={() => {
                                    //加载生词
                                    this.props.navigation.navigate('GroupVoca', {
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
                                                        this.props.app.confirmModal.show(`删除生词本"${item.groupName}"?`, null,
                                                            () => { this._deleteVocaGroup(item.groupName) })
                                                    }}>
                                                        <Text style={{ fontSize: 14, color: 'red', marginRight: 10 }}>删除</Text>
                                                    </TouchableNativeFeedback>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </TouchableNativeFeedback>
                            )

                        })}

                    </ScrollView>

                </View>
                {/* 添加 编辑*/}
                <CardView
                    cardElevation={5}
                    cardMaxElevation={5}
                    cornerRadius={20}
                    style={gstyles.footer}>
                    <View style={gstyles.r_around}>
                        <Button
                            type="clear"
                            icon={<AliIcon name="tianjia" size={20} color="#303030" />}
                            title='添加'
                            titleStyle={gstyles.md_black_bold}
                            onPress={() => {
                                InputTemplate.show({
                                    commonModal: this.props.app.commonModal,
                                    modalHeight: 160,
                                    title: '新建生词本',
                                    placeholder: '请输入生词本名称',
                                    onCancel: null,
                                    onConfirm: this._addVocaGroup
                                })
                            }}>
                        </Button>
                        <View style={{ width: 1, height: 20, backgroundColor: '#555' }}></View>
                        <Button
                            type="clear"
                            icon={<AliIcon name="bianji1" size={20} color="#303030" />}
                            title={this.state.inEdit ? '完成' : '编辑'}
                            titleStyle={gstyles.md_black_bold}
                            onPress={this._toggleEdit}>
                        </Button>
                    </View>
                </CardView>

            </View>
        );
    }
}


const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {
    syncGroup: VGroupAction.syncGroup
}



export default connect(mapStateToProps, mapDispatchToProps)(VocaGroupPage)