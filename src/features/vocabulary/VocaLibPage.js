import React, { Component } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CardView from 'react-native-cardview'
import Picker from 'react-native-picker';
import * as PlanAction from './redux/action/planAction'

import styles from './VocaLibStyle'
import gstyles from "../../style";
import { CountDownLoader } from "../../component/Loader";
import _util from '../../common/util'

class VocaLibPage extends Component {

    constructor(props) {
        super(props)
        this.planTimer = null

        this.state = {
            books: []
        }
    }


    componentDidMount() {
        this._loadBooks()
    }



    componentWillUnmount() {
        if (this.planTimer) {
            clearTimeout(this.planTimer)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.home.isLoadPending === true && nextProps.home.isLoadPending === false) {
            this.props.navigation.goBack()
            return false
        } else {
            return true
        }
    }

    _loadBooks = async () => {
        //加载书籍
        const res = await Http.get("/vocaBook/list?type=" + this.props.vocaBookType)
        console.log('----获取全部单词书-----' + this.props.vocaBookType)
        console.log(res.data);
        if (res.status === 200) {
            this.setState({
                books: res.data
            })
        }
    }

    /**显示选择器 */
    _showPicker = (el) => {
        let data = [
            ['新学10/复习50',      //10
                '新学14/复习70',
                '新学20/复习100',
                '新学26/复习130',
                '新学36/复习180',]
        ];
        let selectedValue = [15];
        Picker.init({
            pickerTextEllipsisLen: 10,
            pickerData: data,
            selectedValue: selectedValue,
            pickerCancelBtnText: '取消',
            pickerTitleText: el.name,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnColor: [30, 30, 30, 1],
            pickerTitleColor: [30, 30, 30, 1],
            pickerConfirmBtnColor: [30, 30, 30, 1],
            pickerToolBarBg: [255, 233, 87, 1],
            onPickerConfirm: async (data) => {
                // console.log(data)
                const sum = parseInt(data[0].replace(/新学(\d+).+/, '$1'))
                let taskCount = null
                let taskWordCount = null
                if (sum <= 19) {
                    taskCount = 1 //1
                } else if (sum <= 34) {
                    taskCount = 2 //2
                } else if (sum <= 54) {
                    taskCount = 3 //3
                }
                taskWordCount = sum / taskCount
                console.log('制定计划，单词书编号为：' + el._id)
                console.log(taskCount, taskWordCount);
                //提交计划
                if (taskCount !== null && taskWordCount !== null) {
                    const isExacted = await _util.checkLocalTime()
                    if (isExacted) {
                        this.props.changeVocaBook({
                            bookId: el._id,
                            totalWordCount: el.count,
                            taskCount: taskCount,
                            taskWordCount: taskWordCount,
                            lastLearnDate: this.props.home.lastLearnDate
                        })
                        //开始倒计时
                        this.refs.countDownLoader && this.refs.countDownLoader.countDown(7)
                    }
                } else {
                    console.error('VocaLibPage: 设置计划时，数据错误！')
                }
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
            }
        });
        Picker.show();
    }

    _renderBook = ({ item, index }) => {
        return <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
                this._showPicker(item)
            }}>
            <View style={[gstyles.r_start, styles.bookView]} >
                <CardView
                    cardElevation={5}
                    cardMaxElevation={5}
                    style={styles.imgCard}
                >
                    <Image source={{ uri: item.coverUrl }} style={styles.img} />
                </CardView>
                <View style={[styles.bookContent, gstyles.c_between_left]}>
                    <View >
                        <Text style={styles.bookname}>{item.name}</Text>
                        <Text style={styles.note}>这是一本词汇书，非常有用</Text>
                    </View>
                    <Text style={styles.wordCount}>共<Text style={[styles.wordCount, { color: '#F29F3F' }]}>{item.count}</Text>个单词</Text>

                </View>
            </View>
        </TouchableOpacity>
    }




    render() {
        //数据
        const { isLoadPending, loadingType } = this.props.plan
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.state.books}
                    renderItem={this._renderBook}
                    keyExtractor={item => item._id}
                />
                {/* {isLoadPending &&
                    <CountDownLoader ref="countDownLoader" />
                } */}

            </View>


        );
    }
}

VocaLibPage.propTypes = {
    vocaBookType: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
    plan: state.plan,
    home: state.home
});

const mapDispatchToProps = {

    changeVocaBook: PlanAction.changeVocaBook
}



export default connect(mapStateToProps, mapDispatchToProps)(VocaLibPage);