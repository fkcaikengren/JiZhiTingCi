import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import CardView from 'react-native-cardview'
import { Header, Button } from 'react-native-elements'
import gstyles from "../../style";
import AliIcon from "../../component/AliIcon";
import * as HomeAction from './redux/action/homeAction'
import * as PlanAction from './redux/action/planAction'
import PlanSelectTemplate from "./component/PlanSelectTemplate";
import _util from "../../common/util";
import FileService from "../../common/FileService";
import { VOCABULARY_DIR } from "../../common/constant";


const styles = StyleSheet.create({
    img: {
        width: 100,
        height: 140,
    },
    wordCount: {
        fontSize: 14,
        color: '#444',
        marginTop: 5
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1962dd',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});


class VocaPlanPage extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            const { isOpen, hide } = this.props.app.commonModal
            if (isOpen()) {
                hide()
            } else {
                this._goBack()
            }
            return true
        })

        // 初始化
        this._init()
    }

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress')
    }

    _init = async () => {
        //加载单词书封面
        const { plan, bookCoverSource } = this.props.plan
        if (plan && plan.bookCoverUrl && !bookCoverSource) {
            const bookCoverSource = await FileService.getInstance().load(VOCABULARY_DIR, plan.bookCoverUrl)
            this.props.loadBookCoverSource({
                bookCoverSource
            })
        }
    }

    _goBack = () => {
        this.props.syncTask(null)
        this.props.navigation.goBack();
    }


    /**确认提交计划 */
    _modifyPlan = async ({ taskCount, taskWordCount, reviewWordCount, totalDays, leftDays }) => {
        //提交计划
        if (taskCount !== null && taskWordCount !== null) {
            const isExacted = await _util.checkLocalTime()
            if (isExacted) {
                this.props.modifyPlan({
                    plan: {
                        taskCount,
                        taskWordCount,
                        reviewWordCount,
                        totalDays,
                    },
                    leftDays: leftDays
                })
            }
        }
    }

    render() {
        const {
            bookId,
            bookName,
            taskCount,
            taskWordCount,
            reviewWordCount,
            totalWordCount,
            totalDays,
        } = this.props.plan.plan
        const book = {
            _id: bookId,
            name: bookName,
            count: totalWordCount,
        }
        return (
            <View style={{ flex: 1 }}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={this._goBack} />}
                    centerComponent={{ text: '学习计划', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        borderBottomColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                <View style={[gstyles.c_center, { flex: 1, width: '100%' }]} >
                    {bookId &&
                        <View style={[gstyles.c_start]}>
                            <CardView
                                cardElevation={5}
                                cardMaxElevation={5}
                                style={{ marginBottom: 20 }}
                            >
                                <Image source={this.props.plan.bookCoverSource} style={styles.img} />
                            </CardView>
                            <Text style={gstyles.lg_black_bold}>{bookName}</Text>
                            <Text style={[gstyles.md_black, { marginTop: 5 }]}>每日新学{taskWordCount * taskCount}词，复习{reviewWordCount}词</Text>
                            <Text style={styles.wordCount}>(共<Text style={[styles.wordCount, { color: '#F29F3F' }]}>{totalWordCount}</Text>个单词)</Text>

                            <Button
                                title={"修改计划"}
                                titleStyle={gstyles.lg_black}
                                containerStyle={{ width: 200, height: 60, marginTop: 40 }}
                                buttonStyle={{
                                    backgroundColor: gstyles.mainColor,
                                    borderRadius: 50,
                                }}
                                onPress={() => {
                                    _util.checkNet(() => {
                                        //显示计划选择器
                                        PlanSelectTemplate.show({
                                            commonModal: this.props.app.commonModal,
                                            book: book,
                                            learnCount: taskCount * taskWordCount,
                                            onConfirm: this._modifyPlan,
                                            isModifyPlan: true
                                        })
                                    })
                                }}
                            />
                        </View>
                    }
                    {!bookId &&
                        <View style={[gstyles.c_start, { marginTop: 50 }]}>
                            <AliIcon name='no-data' size={60} color={gstyles.gray}></AliIcon>
                            <Text style={{ fontSize: 16, color: gstyles.gray, marginTop: 15 }}>无学习计划</Text>
                        </View>
                    }

                    <Button
                        title={bookId ? "更换单词书" : "选择单词书"}
                        titleStyle={gstyles.lg_black}
                        containerStyle={{ width: 200, height: 60, marginTop: bookId ? 10 : 50 }}
                        buttonStyle={{
                            backgroundColor: gstyles.mainColor,
                            borderRadius: 50,
                        }}
                        onPress={() => {
                            _util.checkNet(() => {
                                this.props.navigation.navigate("VocaLibTab")
                            })
                        }}
                    />
                </View>
            </View>
        );
    }
}


const mapStateToProps = state => ({
    app: state.app,
    plan: state.plan
});

const mapDispatchToProps = {
    syncTask: HomeAction.syncTask,
    modifyPlan: PlanAction.modifyPlan,
    loadBookCoverSource: PlanAction.loadBookCoverSource
}


export default connect(mapStateToProps, mapDispatchToProps)(VocaPlanPage);