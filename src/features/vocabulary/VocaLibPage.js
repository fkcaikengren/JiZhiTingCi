import React, { Component } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CardView from 'react-native-cardview'

import Picker from '@gregfrench/react-native-wheel-picker'
import * as PlanAction from './redux/action/planAction'
import styles from './VocaLibStyle'
import gstyles from "../../style";
import _util from '../../common/util'
import AliIcon from "../../component/AliIcon";
import { LEFT_PLUS_DAYS } from "./common/constant";

const PickerItem = Picker.Item;
const planOptions = [{
    value: '新学10 复习50',
    learnCount: 10,
    reviewCount: 50,
    taskCount: 1,
},
{
    value: '新学14 复习70',
    learnCount: 14,
    reviewCount: 70,
    taskCount: 1,
},
{
    value: '新学20 复习100',
    learnCount: 20,
    reviewCount: 100,
    taskCount: 2,
},
{
    value: '新学26 复习130',
    learnCount: 26,
    reviewCount: 130,
    taskCount: 2,
},
{
    value: '新学36 复习180',
    learnCount: 36,
    reviewCount: 180,
    taskCount: 3,
},]

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


    _renderPlanSelector = ({ commonModal, book }) => {
        return () => {
            const {
                getContentState,
                setContentState,
                hide
            } = commonModal
            const { itemList, selectedItem } = getContentState()
            const { learnCount, reviewCount, taskCount } = itemList[selectedItem]
            const totalDays = Math.ceil(book.count / learnCount) + LEFT_PLUS_DAYS
            return <View style={[gstyles.c_start, { flex: 1, width: "100%" }]}>
                <View style={{ position: "absolute", top: 5, right: 5 }}>
                    <AliIcon name='guanbi' size={26} color='#555' onPress={() => {
                        hide()
                    }} />
                </View>
                <Text style={[gstyles.lg_black_bold, { marginTop: 40 }]}>
                    {book.name}
                </Text>
                <Text style={[gstyles.md_black, { marginTop: 10 }]}>
                    每日新学<Text style={styles.emFont}>{learnCount}</Text>词, 复习<Text style={styles.emFont}>{reviewCount}</Text>词
                </Text>
                <Text style={[gstyles.md_black, { marginTop: 5 }]}>
                    完成需要<Text style={styles.emFont}>{totalDays}</Text>天
                    </Text>
                <Picker style={{ width: "100%", height: 200, marginTop: 10, }}
                    selectedValue={selectedItem}
                    itemStyle={{ color: "#202020", fontSize: 20 }}
                    onValueChange={(index) => {
                        setContentState({
                            selectedItem: index,
                        })
                    }}>
                    {itemList.map((item, i) => (
                        <PickerItem label={item.value} value={i} key={"plan" + item.value} />
                    ))}
                </Picker>
                <Button
                    title="确定"
                    titleStyle={gstyles.lg_black}
                    containerStyle={{ width: 150, height: 60, marginTop: 10 }}
                    buttonStyle={{
                        backgroundColor: gstyles.mainColor,
                        borderRadius: 50,
                    }}
                    onPress={() => {
                        this._putPlan({
                            bookId: book._id,
                            taskCount: taskCount,
                            taskWordCount: learnCount,
                            reviewWordCount: reviewCount,
                            totalDays
                        })
                    }}
                />


            </View>


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
                const {
                    setContentState,
                    show
                } = this.props.app.commonModal
                setContentState({
                    selectedItem: 2,
                    itemList: planOptions
                })
                show({
                    renderContent: this._renderPlanSelector({ commonModal: this.props.app.commonModal, book: item }),
                    modalStyle: {
                        width: 300,
                        height: 440,
                        borderRadius: 10,
                        backgroundColor: "#FFF",
                    },
                })
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
    app: state.app,
    plan: state.plan,
    home: state.home
});

const mapDispatchToProps = {

    changeVocaBook: PlanAction.changeVocaBook
}



export default connect(mapStateToProps, mapDispatchToProps)(VocaLibPage);