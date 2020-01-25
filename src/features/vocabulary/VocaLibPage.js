import React, { Component } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CardView from 'react-native-cardview'
import * as PlanAction from './redux/action/planAction'

import styles from './VocaLibStyle'
import gstyles from "../../style";
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
        //提交计划
        if (taskCount !== null && taskWordCount !== null) {
            const isExacted = true
            // await _util.checkLocalTime()
            if (isExacted) {
                this.props.changeVocaBook({
                    plan: {
                        bookId: el._id,
                        bookName: el.name,
                        taskCount: taskCount,
                        taskWordCount: taskWordCount,
                    },
                    totalWordCount: el.count,
                    lastLearnDate: this.props.home.lastLearnDate
                })
            }
        }

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
                        <Text style={styles.note}>{item.desc}</Text>
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
    plan: state.plan,
    home: state.home
});

const mapDispatchToProps = {

    changeVocaBook: PlanAction.changeVocaBook
}



export default connect(mapStateToProps, mapDispatchToProps)(VocaLibPage);