import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';   
import Swiper from 'react-native-swiper'
import {Header, Button} from 'react-native-elements'
import Toast from 'react-native-easy-toast'

import AliIcon from '../../component/AliIcon';
import * as VocaListAction from './redux/action/vocaListAction'
import * as VocaPlayAction from './redux/action/vocaPlayAction'
import VocaTaskDao from "./service/VocaTaskDao";
import VocaListPage from "./VocaListPage";
import styles from './VocaListStyle'
import * as Constant from './common/constant'
import gstyles from "../../style";

//暂时
// VocaTaskDao.getInstance().open()

class VocaListTabPage extends Component {

    constructor(props){
        super(props)
        this.state = {
            pageIndex:0,
            toastRef:null
        }
         //隐藏黄色警告
         console.disableYellowBox=true;
    }

    componentDidMount(){
        this.setState({toastRef:this.toastRef})
    }

    _movePage = (clickIndex)=>{
        if(this.props.vocaList.onEdit){
            this.state.toastRef.show('当前处于编辑状态，不可以切换卡片哦')
        }else{
            console.log(clickIndex - this.state.pageIndex)
            this.swiperRef.scrollBy(clickIndex - this.state.pageIndex,true)
        }
    }

    render() {
        const editBtn = this.props.vocaList.onEdit?<Text style={gstyles.md_black}>取消</Text>
        :<AliIcon name='bianji' size={24} color={gstyles.black}></AliIcon>
        const selectTextStyle = [{ borderBottomWidth:2, borderBottomColor: gstyles.black },gstyles.sm_black_bold]
        const index = this.state.pageIndex

        return (
           
            <View style={{flex:1}}>
                <StatusBar translucent={true} />
                <Header
                statusBarProps={{ barStyle:'dark-content' }}
                barStyle='dark-content' // or directly
                leftComponent={  <AliIcon name='fanhui' size={24} color={gstyles.black} onPress={()=>{
                        if(this.props.vocaList.onEdit){
                            this.state.toastRef.show('当前处于编辑状态，不可以退出哦')
                        }else{
                            this.props.navigation.goBack();
                        }
                    }} /> }
                rightComponent={ <TouchableWithoutFeedback onPress={()=>{this.props.toggleEdit()}}>
                    { editBtn }
                    </TouchableWithoutFeedback>
                }
                centerComponent={{ text: '单词列表', style: gstyles.lg_black_bold }}
                containerStyle={{
                    backgroundColor: gstyles.mainColor,
                    borderBottomColor: gstyles.mainColor,
                    justifyContent: 'space-around',
                }}
                />
                <View style={styles.tabBar}>
                    <View style={styles.tabBtn}
                        onStartShouldSetResponder={() => true}
                        onResponderStart={(e)=>{this._movePage(0)}}
                    >
                        <Text style={[gstyles.sm_gray,styles.tabText, index===0?selectTextStyle:null]}>错词</Text>
                    </View>
                    <View style={styles.tabBtn}
                        onStartShouldSetResponder={() => true}
                        onResponderStart={(e)=>{this._movePage(1)}}
                    >
                        <Text style={[gstyles.sm_gray,styles.tabText, index===1?selectTextStyle:null]}>PASS</Text>
                    </View>
                    <View style={styles.tabBtn}
                        onStartShouldSetResponder={() => true}
                        onResponderStart={(e)=>{this._movePage(2)}}
                    >
                        <Text style={[gstyles.sm_gray,styles.tabText, index===2?selectTextStyle:null]}>已学</Text>
                    </View>
                    <View style={styles.tabBtn}
                        onStartShouldSetResponder={() => true}
                        onResponderStart={(e)=>{this._movePage(3)}}
                    >
                        <Text style={[gstyles.sm_gray,styles.tabText, index===3?selectTextStyle:null]}>未学</Text>
                    </View>
                </View>
               <Swiper 
                    ref={ref=>this.swiperRef = ref}
                    showsPagination={false}
                    loop={false}
                    onIndexChanged={(index)=>{this.setState({pageIndex:index})}}
                    index={this.state.pageIndex}
                    scrollEnabled={!this.props.vocaList.onEdit}
                    loadMinimal loadMinimalSize={2} 
                    >
                    <VocaListPage {...this.props} type={Constant.WRONG_LIST} 
                        index={0}
                        pageIndex={this.state.pageIndex}
                        toastRef={this.state.toastRef}/>
                    <VocaListPage {...this.props} type={Constant.PASS_LIST} 
                        index={1}
                        pageIndex={this.state.pageIndex}
                        toastRef={this.state.toastRef}/>
                    <VocaListPage {...this.props} type={Constant.LEARNED_LIST} 
                        index={2}
                        pageIndex={this.state.pageIndex}
                        toastRef={this.state.toastRef}/>
                    <VocaListPage {...this.props} type={Constant.NEW_LIST} 
                        index={3}
                        pageIndex={this.state.pageIndex}
                        toastRef={this.state.toastRef}/>
                </Swiper>
                <Toast
                    ref={ref=>this.toastRef = ref}
                    position='top'
                    positionValue={120}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />  
            </View>
        );
    }
}

const mapStateToProps = state =>({
    vocaList: state.vocaList,
    vocaPlay: state.vocaPlay
});

const mapDispatchToProps = {
    toggleEdit: VocaListAction.toggleEdit,
    changePlayTimer : VocaPlayAction.changePlayTimer
}


export default connect(mapStateToProps,mapDispatchToProps )(VocaListTabPage);