

'use strict';
import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import { Header } from 'react-native-elements'
import { connect } from 'react-redux';

import * as HomeAction from './redux/action/homeAction'
import AliIcon from '../../component/AliIcon';
import gstyles from '../../style'
import VocaTaskDao from "./service/VocaTaskDao";
import { DETAIL_READ } from "../reading/common/constant";
import VocaUtil from "./common/vocaUtil";


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    nameView: {
        flex: 1
    },
    noteText: {
        fontSize: 12,
        lineHeight: 24,
        marginLeft: 3,
    },
})


class ArticleManagePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articles: []
        };
        this.taskDao = VocaTaskDao.getInstance()
        console.disableYellowBox = true;
    }

    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
        //查询已学习过的任务 
        this._init()
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }

    _init = () => {
        const learnedTasks = this.taskDao.getLearnedTasks()
        const articles = VocaUtil.genArticleTasksByVocaTasks(learnedTasks)
        this.setState({ articles })
    }


    _renderRight = (item) => {
        let type = ''
        switch (item.type) {
            case DETAIL_READ:
                type = '仔细阅读'
                break
            case MULTI_SELECT_READ:
                type = '选词填空'
                break
            case FOUR_SELECT_READ:
                type = '选词填空'
                break
            case EXTENSIVE_READ:
                type = '泛读'
                break
        }

        const hasScore = (item.score !== -1)
        const textStyle = hasScore ? { fontSize: 26, color: gstyles.emColor, marginRight: 10, } : [gstyles.lg_gray, { paddingRight: 10 }]
        return <View style={[{ height: '100%' }, hasScore ? gstyles.r_start_bottom : gstyles.r_start]}>
            {hasScore &&
                <Text style={[gstyles.xs_gray, { paddingBottom: 5, paddingRight: 5 }]}>正确率:</Text>
            }
            <Text style={textStyle}>{hasScore ? item.score + '%' : type}</Text>
        </View>
    }

    _renderItem = ({ item, index }) => {

        let serial = 0
        if (index < 10) {
            serial = '00' + (index + 1)
        } else if (index < 100) {
            serial = '0' + (index + 1)
        } else {
            serial = '' + (index + 1)
        }

        const hasScore = (item.score !== -1)
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                this.props.navigation.navigate('ArticleTab', { articleInfo: item })
            }}>
                <View style={[{ flex: 1 }, gstyles.r_start]}>
                    <View style={[{ flex: 1 }, gstyles.c_center]}>
                        <Text style={gstyles.serialText}>{serial}</Text>
                    </View>
                    <View style={[{
                        flex: 6, padding: 10, borderColor: '#DFDFDF',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }, hasScore ? gstyles.r_between_bottom : gstyles.r_between]}>
                        <View stye={styles.nameView}>
                            <Text style={[gstyles.md_black, { fontWeight: '500' }]}>{item.name}</Text>
                            <View style={styles.r_start}>
                                <Text style={styles.noteText}>{item.note}</Text>
                            </View>
                        </View>
                        {
                            this._renderRight(item)
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }



    render() {
        return (
            <View style={styles.container}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content'
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack()
                            this.props.syncTask(null)
                        }} />}
                    centerComponent={{ text: '阅读真题', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                {this.state.articles.length <= 0 &&
                    <View style={[gstyles.c_center, { flex: 1 }]}>
                        <AliIcon name={'no-data'} size={100} color={gstyles.gray} />
                        <Text style={gstyles.md_gray}>学过的阅读真题会出现在这里</Text>
                    </View>
                }
                {this.state.articles.length > 0 &&
                    <FlatList
                        data={this.state.articles}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => item.id}
                    />
                }
            </View>
        );
    }
}
const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {
    syncTask: HomeAction.syncTask,
}


export default connect(mapStateToProps, mapDispatchToProps)(ArticleManagePage);