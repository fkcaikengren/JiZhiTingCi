import React, { Component } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CardView from 'react-native-cardview'

import * as PlanAction from './redux/action/planAction'
import styles from './VocaLibStyle'
import gstyles from "../../style";
import _util from '../../common/util'
import PlanSelectTemplate from "./component/PlanSelectTemplate";



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
        if (res.status === 200) {
            this.setState({
                books: res.data
            })
        }
    }


    /**确认提交计划 */
    _putPlan = ({ bookId, taskCount, taskWordCount, reviewWordCount, totalDays }) => {
        //提交计划
        if (taskCount !== null && taskWordCount !== null) {
            const isExacted = true
            // await _util.checkLocalTime() #todo:检查时间
            if (isExacted) {
                this.props.changeVocaBook({
                    plan: {
                        bookId,
                        taskCount,
                        taskWordCount,
                        reviewWordCount,
                        totalDays,
                    },

                })
            }
        }

    }

    _renderBook = ({ item, index }) => {
        return <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
                //判断权限
                if (item.price > 0 && item.payed === false) {
                    this.props.navigation.navigate('VocaLibPay', {
                        book: item,
                        loadBooks: this._loadBooks
                    })
                    return
                }
                //显示计划选择器
                PlanSelectTemplate.show({
                    commonModal: this.props.app.commonModal,
                    book: item,
                    onConfirm: this._putPlan
                })
            }}>
            <View style={[gstyles.r_start_top, styles.bookView]} >
                <CardView
                    cardElevation={5}
                    cardMaxElevation={5}
                    style={styles.imgCard}
                >
                    <Image source={{ uri: item.coverUrl }} style={styles.img} />
                    {item.payed &&
                        <View style={styles.payedBadge}>
                            <Text style={{ fontSize: 8, color: '#FFF', fontWeight: '500' }}>已购买</Text>
                        </View>
                    }
                </CardView>
                <View style={[styles.bookContent, gstyles.c_between_left]}>
                    <View style={[{ height: '70%' }, gstyles.c_start_left]}>
                        <Text style={styles.bookname}>{item.name}</Text>
                        <Text numberOfLine={2} style={styles.note}>{item.desc}</Text>
                        {item.price > 0 &&
                            <Text style={styles.price}>{`￥${item.price.toFixed(2)}`}</Text>
                        }
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


            </View>


        );
    }
}

VocaLibPage.propTypes = {
    vocaBookType: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
    app: state.app,
    plan: state.plan,
    home: state.home
});

const mapDispatchToProps = {

    changeVocaBook: PlanAction.changeVocaBook
}



export default connect(mapStateToProps, mapDispatchToProps)(VocaLibPage);