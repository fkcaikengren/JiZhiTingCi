


import React, {Component} from 'react';
import {Platform, StatusBar, View, Text,Easing, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {Header, Slider } from 'react-native-elements'
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
import ModalBox from 'react-native-modalbox';
import Swiper from 'react-native-swiper'

import styles from './ArticleTabStyle'
import gstyles from '../../style'
import ColorRadio from './component/ColorRadio'
import AliIcon from '../../component/AliIcon'
import * as ArticleAction from './redux/action/articleAction'
import ArticlePage from './ArticlePage';
import QuestionPage from './QuestionPage';

/**
 *Created by Jacy on 19/08/09.
 */
class ArticleTabPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            pageIndex:0,
            showKeyWords:true,
            showSettingModal:true,
        }
    }

    //改变字体大小
    _onFontChange = (fontRem)=>{
        const {changeFontSize} = this.props
        changeFontSize(fontRem)
    }
    //改变主题颜色
    _onBgChange = (index, value)=>{
        const {changeBgtheme} = this.props
        changeBgtheme(index)
        
    }

    //显示隐藏关键词
    _toggleKeyWords = ()=>{
        this.props.toggleKeyWords()
    }
    _openSettingModal = ()=>{
        this.setState({showSettingModal:true})
    }

    _closeSettingModal = ()=>{
        this.setState({showSettingModal:false})
    }
    
    // 创建字号背景设置面板
    _createSettingModal = ()=>{
        const {bgThemes, themeIndex, fontRem} = this.props.article
        console.log(this.props.article)
         // 获取任务列表数据
         const {showSettingModal} = this.state
         return <ModalBox style={[styles.settingModal, {backgroundColor:bgThemes[themeIndex]}]}
             isOpen={showSettingModal} 
             onClosed={this._closeSettingModal}
             onOpened={this._openSettingModal}
             backdrop={true} 
             backdropPressToClose={true}
             swipeToClose={false}
             position={"bottom"} 
             easing={Easing.elastic(0.2)}
             ref={ref => {
                 this.settingModal = ref
             }}>
                <View style={[gstyles.r_start, styles.colorRadioView]}>
                    <Text style={styles.settingLabel}>主题</Text>
                    <ColorRadio 
                        colors={['#FFFFFF', '#FFCCFF', '#F7F5D6', '#E4CFA4',
                        '#BADFC0', '#EFEFEF', '#222222']}
                        selectedIndex={themeIndex}
                        size={20}
                        containerStyle={{width:240,}}
                        onChange={this._onBgChange}
                    />
                </View>
                <View style={[gstyles.r_start, styles.fontRemView]}>
                    <Text style={styles.settingLabel}>字号</Text>
                    <Text style={{fontSize:12,color:'#F29F3F'}}>A</Text>
                    <Slider
                        value={fontRem}
                        onValueChange={this._onFontChange}
                        maximumValue={1.2}
                        minimumValue={0.8}
                        step={0.1}
                        style={{
                            width:200,height:40,
                            marginHorizontal:10,}}
                        thumbStyle={{backgroundColor:'#F29F3F'}}
                    />
                    <Text style={{fontSize:20,color:'#F29F3F'}}>A</Text>
                </View>

         </ModalBox>
    }
   


    render(){
        const {bgThemes, themeIndex, showKeyWords} = this.props.article
        let s1={}, s2={}
        const selectStyle = {
            color:'#303030',
            borderBottomWidth:1,
            borderColor:'#303030'
        }
        if(this.state.pageIndex===0){
            s1 = selectStyle
        }else{
            s2 = selectStyle
        }
        return(
            <View style={{ flex:1, }}>
                {/* 头部 */}
                <StatusBar translucent={true} />
                <Header
                statusBarProps={{ barStyle: 'light-content' }}
                barStyle="light-content" // or directly
                leftComponent={ 
                    <AliIcon name='fanhui' size={24} color='#555' onPress={()=>{
                        this.props.navigation.goBack();
                    }}></AliIcon> }
                centerComponent={
                    <View style={gstyles.r_center}>
                        <Text style={[styles.tabTitle,s1, {marginRight:10}]}>文章</Text>
                        <Text style={[styles.tabTitle,s2]}>答题</Text>
                    </View>
                }
                rightComponent={
                    <View style={[gstyles.r_start]}>
                        
                        <TouchableWithoutFeedback onPress={this._handin}>
                            <Text style={styles.handinBtn}>交卷</Text>
                        </TouchableWithoutFeedback>
                        
                        <Menu  renderer={renderers.Popover} rendererProps={{placement: 'bottom'}}>
                            <MenuTrigger >
                                <AliIcon name='add' size={24} color='#555'></AliIcon>
                            </MenuTrigger>
                            <MenuOptions style={styles.menuOptions}>
                            <MenuOption onSelect={this._toggleKeyWords} style={styles.menuOptionView}>
                                    <Text style={styles.menuOptionText}>{showKeyWords?'隐藏关键词':'显示关键词'}</Text>
                            </MenuOption>
                                
                                <MenuOption onSelect={this._openSettingModal} style={styles.menuOptionView}>
                                        <Text style={styles.menuOptionText}>主题字号</Text>
                                </MenuOption>
                               
                                <MenuOption onSelect={() => alert(`Delete`)} style={styles.menuOptionView}>
                                        <Text style={styles.menuOptionText}>分享</Text>
                                </MenuOption>
                                
                                <MenuOption onSelect={() => alert(`Delete`)} 
                                    style={[styles.menuOptionView,{borderBottomWidth:0}]}>
                                        <Text style={styles.menuOptionText}>纠错</Text>
                                </MenuOption>
                                
                                
                            </MenuOptions>
                        </Menu>
                        
                        
                        
                    </View>
                }
                containerStyle={{
                    backgroundColor: bgThemes[themeIndex],
                    justifyContent: 'space-around',
                }}
                />
                <Swiper 
                    showsPagination={false}
                    loop={false}
                    onIndexChanged={(index)=>{this.setState({pageIndex:index})}}>
                    <ArticlePage />
                    <QuestionPage />
                    
                </Swiper>
                 {/* 答悬浮按钮 */}
                 <TouchableWithoutFeedback onPress={()=>{
                    //跳转
                    this.props.navigation.navigate('Analysis',{handin:false})
                    }}>
                    <View style={[styles.floatBtn]}>
                        <AliIcon name='iconfontyoujiantou-copy-copy-copy' size={16} color='#303030'></AliIcon>
                        <View>
                            <Text style={styles.floatText}>解</Text>
                            <Text style={styles.floatText}>析</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {
                    this._createSettingModal()
                }
            </View>
        );
    }
}



const mapStateToProps = state =>({
    article : state.article,

});

const mapDispatchToProps = {
    changeBgtheme : ArticleAction.changeBgtheme,
    changeFontSize : ArticleAction.changeFontSize,
    toggleKeyWords : ArticleAction.toggleKeyWords
    
};
export default connect(mapStateToProps, mapDispatchToProps)(ArticleTabPage);