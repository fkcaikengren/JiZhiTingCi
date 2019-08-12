import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';   
import Swiper from 'react-native-swiper'

import {Header, Button} from 'react-native-elements'
import AliIcon from '../../component/AliIcon';
import VocaListTabNavgator from "./navigation/VocaListTabNav";
import * as VocaListAction from './redux/action/vocaListAction'
import VocaTaskDao from "./service/VocaTaskDao";
import WrongListPage from "./WrongListPage";
import PassListPage from "./PassListPage";
import LearnedListPage from "./LearnedListPage";
import NewListPage from "./NewListPage";
import styles from './VocaListStyle'

//暂时
VocaTaskDao.getInstance().open()

class VocaListPage extends Component {

    constructor(props){
        super(props)
        this.state = {
            pageIndex:0,
        }
         //隐藏黄色警告
         console.disableYellowBox=true;
    }

    render() {
        const selectPageStyle = {
            borderBottomWidth:2,
            borderBottomColor:'#F29F3F'
        }
        const index = this.state.pageIndex

        return (
            <View style={{flex:1}}>
                <StatusBar translucent={true} />
                <Header
                statusBarProps={{ barStyle: 'light-content' }}
                barStyle="light-content" // or directly
                leftComponent={ 
                    <AliIcon name='fanhui' size={26} color='#303030' onPress={()=>{
                        this.props.navigation.goBack();
                    }}/> }
                rightComponent={
                    <TouchableWithoutFeedback onPress={()=>{this.props.toggleEdit()}}>
                         <Text>编辑</Text>
                    </TouchableWithoutFeedback>
                }
                centerComponent={{ text: '单词列表', style: { color: '#303030', fontSize:18 } }}
                containerStyle={{
                    backgroundColor: '#FCFCFC',
                    justifyContent: 'space-around',
                }}
                />
                <View style={styles.tabBar}>
                    <View style={styles.tabBtn}
                        // onStartShouldSetResponder={() => true}
                        // onResponderStart={(e)=>{this.setState({pageIndex:0})}}
                    >
                        <Text style={[styles.tabText, index===0?selectPageStyle:null]}>错词</Text>
                    </View>
                    <View style={styles.tabBtn}
                        // onStartShouldSetResponder={() => true}
                        // onResponderStart={(e)=>{this.setState({pageIndex:1})}}
                    >
                        <Text style={[styles.tabText, index===1?selectPageStyle:null]}>PASS</Text>
                    </View>
                    <View style={styles.tabBtn}
                        // onStartShouldSetResponder={() => true}
                        // onResponderStart={(e)=>{this.setState({pageIndex:2})}}
                    >
                        <Text style={[styles.tabText, index===2?selectPageStyle:null]}>未学</Text>
                    </View>
                    <View style={styles.tabBtn}
                        // onStartShouldSetResponder={() => true}
                        // onResponderStart={(e)=>{this.setState({pageIndex:3})}}
                    >
                        <Text style={[styles.tabText, index===3?selectPageStyle:null]}>新学</Text>
                    </View>
                </View>
               <Swiper 
                    showsPagination={false}
                    loop={false}
                    onIndexChanged={(index)=>{this.setState({pageIndex:index})}}
                    index={this.state.pageIndex}
                    scrollEnabled={!this.props.vocaList.onEdit}
                    >
                    <WrongListPage />
                    <PassListPage />
                    <LearnedListPage />
                    <NewListPage />
                </Swiper>
            </View>
        );
    }
}

const mapStateToProps = state =>({
    vocaList: state.vocaList
});

const mapDispatchToProps = {
    toggleEdit: VocaListAction.toggleEdit
}


export default connect(mapStateToProps,mapDispatchToProps )(VocaListPage);