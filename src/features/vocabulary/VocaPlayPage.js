import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet, View, Text, FlatList, TouchableNativeFeedback, TouchableWithoutFeedback} from 'react-native';
import {WhiteSpace} from '@ant-design/react-native'
import {Header, Button} from 'react-native-elements'
import { Grid, Col, Row,} from 'react-native-easy-grid'
import * as Progress from '../../component/react-native-progress';
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
import {connect} from 'react-redux';
const Sound = require('react-native-sound');
// import {NavigationActions, StackActions} from 'react-navigation'
import {PropTypes} from 'prop-types'
import * as Constant from './common/constant'
import * as vocaPlayAction from './redux/action/vocaPlayAction';
import AliIcon from '../../component/AliIcon';
import styles from './VocaPlayStyle'


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const ITEM_H = 55;
const StatusBarHeight = StatusBar.currentHeight;

global.VocaPlayFlatList = null; //声明全局遍历对象
global.VocaPlayInterval = 1.0;


class VocaPlayPage extends React.Component {

    static propTypes = {
        vocaDao: PropTypes.object,
        taskDao: PropTypes.object,
        mode: PropTypes.string,
        task: PropTypes.object,
    }

    constructor(props){
        super(props);
        // this.taskDao = this.props.navigation.getParam('taskDao',null)
        this.taskDao = this.props.taskDao
        // this.vocaDao = this.props.navigation.getParam('vocaDao', null)
        this.vocaDao = this.props.vocaDao
        // this.mode = this.props.navigation.getParam('mode', Constant.NORMAL_PLAY)
        this.mode = this.props.mode
        this.controlDisable = false
        if(this.mode !== Constant.NORMAL_PLAY){  //不是正常模式，则禁止操作控制栏
            this.controlDisable = true
        }
        this.state = {
            currentIndex:0,
        }
    }
    componentDidMount(){
        const { loadTask} = this.props
        //加载task
        // const task = navigation.getParam('task', null)
        loadTask(this.mode, this.props.task, this.vocaDao, this.taskDao)

        //判断是否自动播放，task是从navigation中获取，一定存在curIndex
        if(this.controlDisable){
            // 1s后自动播放
            let tm = setTimeout(()=>{
                this._autoplay(0);
            },1000)
        }
    }

    componentWillUnmount(){ //退出界面
       this._quitLearn();
    }

    //退出页面（学习模式下）
    _quitLearn(){
        if(this.controlDisable){  
            VocaPlayFlatList = 0;
            const {autoPlayTimer, curIndex} = this.props.vocaPlay
            const {changePlayTimer} = this.props;  
            //停止播放
            if(autoPlayTimer){
                clearTimeout(autoPlayTimer);
            }
            // //重置单词列表
            // resetPlayList();
            

        }
    }

    /**
     * @description 自动播放 
     * @memberof SwiperFlatList
     */
    _autoplay = (index) => {
        const { task} = this.props.vocaPlay;
        const { words} = task
        const {changePlayTimer} = this.props;

        // 1.滑动 {animated: boolean是否动画, index: item的索引, viewPosition:视图位置（0-1） };
        let params = { animated:true, index, viewPosition:0.5 };
        if (VocaPlayFlatList && words.length>0) { //当words不是空数组时才能移动
            console.log('move');
            VocaPlayFlatList.scrollToIndex(params);
        }


        //2.播放单词音频
        //3.循环回调
        let timer = setTimeout(() => {
            console.log(` words.length ${ words.length}`)
            const nextIndex = (index + 1) % words.length;
            console.log(nextIndex)
            this._replay(  nextIndex);
            
        }, VocaPlayInterval * 1000);
        changePlayTimer(timer);


        //4. 中断播放
        // if(this.controlDisable){
        //     if(curIndex == words.length-1){  //最后一个 12
        //         this.learnPlayTime++
        //     }
       
        //     if(this.learnPlayTime >= 1){ //播放一遍后，进入下一阶段

        //         // 抹掉stack，跳转到指定路由
        //         const  resetAction = StackActions.reset({  
        //             index: 0,
        //             actions: [
        //                 NavigationActions.navigate({routeName:'LearnCard'})
        //             ]
        //         });
        //         this.props.navigation.dispatch(resetAction);
        //         //标记完成轮播学习
        //         finishPlay();
        //     }
        // }
    };
  
    _replay = (index) => {
        console.log(index)
        const { autoPlayTimer, } = this.props.vocaPlay;
        const { changeCurIndex } = this.props;
        
        changeCurIndex(index);
        this.setState({currentIndex:index})
        // 回调自动播放
        if (autoPlayTimer) {
            this._autoplay(index);  
        }

        
    }

    _renderItem = ({item, index})=>{
        let {showWord,showTran} = this.props.vocaPlay;
        //处理中文翻译
        let translation = ''
        if(item.tran !==null && item.tran.length>0){
            const trans = JSON.parse(item.tran)
            for(let i in trans){
                let processdTran = ''
                if(i==0 && trans.length>1 && trans[i].tran.length>9){
                    processdTran = trans[i].tran.substr(0,9) + '..'
                }else{
                    processdTran = trans[i].tran
                }
                translation += `${trans[i].property}.${processdTran}；`
            }
        }
        //字幕的样式
        let playEnStyle = {}
        let playZhStyle = {}
        const {currentIndex } = this.state
        if(currentIndex == index){
            console.log(`curIndex: ${currentIndex}`)
            playEnStyle = {
                fontSize:20,
                color:'red'
            };
            playZhStyle = {
                fontSize:16,
                color:'#FA5735'
            };
        }

        return (
            <View style={styles.item}>
                <Text style={[styles.itemEnText,playEnStyle]}>{showWord?item.word:''}</Text>
                
                <Text note numberOfLines={1} style={[styles.itemZhText,playZhStyle]}>
                    {showTran?translation:''}</Text>
            </View>
        );
    };

    _keyExtractor = (item, index) => index.toString();




    // length: item高度； offset: item的父组件的偏移量
    _getItemLayout = (data, index) =>{
        return ({ length: ITEM_H, offset: ITEM_H * index, index });
    } 

    //选择测试
    _chooseTest = (value) =>{
        switch(value){
            case 0:
                // this.props.navigation.navigate('TestEnTran');
                break;
            case 1:
                // this.props.navigation.navigate('TestSentence');
                break;
            case 2:
                alert(value);
                break;
            case 3:
                alert(value);
                break;
        }
    }

    //选择主题
    _chooseTheme = (themeId)=>{
        const {autoPlayTimer} = this.props.vocaPlay;
        const {changeTheme} = this.props;
        changeTheme(themeId);
    }

    //选择播放时间间隔
    _chooseInterval = (interval)=>{
        const {changeInterval } = this.props;
        VocaPlayInterval = interval;
        changeInterval(VocaPlayInterval);
        
    }

    //播放暂停切换
    _togglePlay = ()=>{
        const {autoPlayTimer, curIndex, } = this.props.vocaPlay;
        const {changePlayTimer} = this.props;
        if(autoPlayTimer){
            //暂停
            clearTimeout(autoPlayTimer);
            changePlayTimer(0);
        }else {
            //播放
            this._autoplay(curIndex);
        }
    }


    render(){

        const {task,  curIndex, themeId, themes, autoPlayTimer,showWord, showTran, interval, } = this.props.vocaPlay;
        const {words} = task
        const {toggleWord, toggleTran, } = this.props;
        
        let bgStyle = {backgroundColor: themes[themeId].bgColor};

        let flatListProps = {
            ref: component => {
                VocaPlayFlatList = component;
            },
            horizontal: false,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            pagingEnabled: false,
            extraData: this.state.currentIndex,     //促使FlatList刷新  
            keyExtractor: this._keyExtractor,
            data:words,
            renderItem: this._renderItem,
            initialNumToRender: 16,
            getItemLayout: this._getItemLayout,
        }

        
        return(
            <View style={[styles.container, bgStyle]}>
                {/* 头部 */}
                <StatusBar translucent={true} />
                <Header
                statusBarProps={{ barStyle: 'light-content' }}
                barStyle="light-content" // or directly
                leftComponent={ 
                    <AliIcon name='fanhui' size={26} color='#FFF' onPress={()=>{
                        this.props.navigation.goBack();
                    }}></AliIcon> }
                
                centerComponent={{ text: '四级词汇', style: { color: '#FFF', fontSize:18 } }}
                containerStyle={{
                    backgroundColor: '#FCFCFC00',
                    borderBottomColor: '#FCFCFC00',
                }}
                />

                {/* 内容列表 */}
                <WhiteSpace size='lg'/>
                <View style={ styles.content}>
                    <FlatList {...flatListProps}/>
                </View>

                {/* 底部控制 */}
                <Grid style={{width:width, position:'absolute', bottom:0}}>
                    {/* 功能按钮 */}
                    <Row style={{
                        flexDirection:'row',
                        justifyContent:'space-around',
                        alignItems:'center',
                    }}>
                        {/* 英文单词按钮 */}
                        <TouchableWithoutFeedback >
                            <Text style={[styles.textIcon, styles.selected]}>
                                en
                            </Text>
                        </TouchableWithoutFeedback>
                        {/* 主题按钮 */}
                        <Menu onSelect={this._chooseTheme} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                            <MenuTrigger disabled={this.controlDisable}  text='主题' customStyles={{triggerText: styles.triggerText,}}/>
                            <MenuOptions>
                                {
                                    themes.map((item, index)=>{
                                        return (
                                            <MenuOption key={item.id} value={item.id}>
                                                <Text style={{color: 'red'}}>{item.name}</Text>
                                            </MenuOption>
                                        );
                                    })
                                }
                                
                            </MenuOptions>
                        </Menu>
                        {/* 测试按钮 */}
                        <Menu onSelect={this._chooseTest} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                            <MenuTrigger disabled={this.controlDisable} text='测试' customStyles={{triggerText: styles.triggerText,}}/>
                            <MenuOptions>
                                <MenuOption value={0} text='英英释义选词' />
                                <MenuOption value={1}>
                                    <Text style={{color: 'red'}}>例句选词</Text>
                                </MenuOption>
                                <MenuOption value={2}>
                                    <Text style={{color: 'red'}}>看词选中义</Text>
                                </MenuOption>
                                <MenuOption value={3}>
                                    <Text style={{color: 'red'}}>听音选词</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                        {/* 中文按钮 */}
                        <TouchableWithoutFeedback >
                            <Text style={[styles.textIcon, styles.selected]}>
                                zh
                            </Text>
                        </TouchableWithoutFeedback>
                    </Row>
                    {/* 进度条 */}
                    <WhiteSpace size='md'/>
                    <Row style={{
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                    }}>
                        <View style={{
                            flexDirection:'row',
                            justifyContent:'center',
                            alignItems:'center',
                        }}>
                            <Text style={{color:'#fff' , marginRight:5}}>{curIndex?curIndex:0}</Text>
                            {/* <Progress.Bar progress={curIndex/10} height={2} width={width-100} color='#F79131' unfilledColor='#DEDEDE' borderWidth={0}/> */}
                            <Progress.Bar 
                                progress={0.4} 
                                height={2} 
                                width={width-100} 
                                color='#F79131' 
                                unfilledColor='#DEDEDE' 
                                borderWidth={0}/>
                            <Text style={{color:'#fff' ,  marginLeft:10}}>{words.length}</Text>
                        </View>
                    </Row>
                    {/* 播放按钮 */}
                    <WhiteSpace size='sm'/>
                    <Row style={{
                        flexDirection:'row',
                        justifyContent:'space-around',
                        alignItems:'center',
                    }}>
                        
                        <Menu onSelect={this._chooseInterval} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                            <MenuTrigger disabled={this.controlDisable} text={interval+'s'} customStyles={{triggerText: styles.intervalButton,}}/>
                            <MenuOptions>
                            <MenuOption value={5.0}>
                                    <Text>5.0s</Text>
                                </MenuOption>
                                <MenuOption value={4.0}>
                                    <Text>4.0s</Text>
                                </MenuOption>
                                <MenuOption value={3.0}>
                                    <Text>3.0s</Text>
                                </MenuOption>
                                <MenuOption value={2.0}>
                                    <Text>2.0s</Text>
                                </MenuOption>
                                <MenuOption value={1.0}>
                                    <Text>1.0s</Text>
                                </MenuOption>
                                
                            </MenuOptions>
                        </Menu>
                        <View style={{
                            width:width*(1/2),
                            flexDirection:'row',
                            justifyContent:'space-around',
                            alignItems:'center',
                        }}>
                            <TouchableNativeFeedback >
                                <AliIcon name='icon-2' size={32} color='#FFF'></AliIcon>
                            </TouchableNativeFeedback>
                            
                            
                            <TouchableNativeFeedback  onPress={this.controlDisable?()=>{}:this._togglePlay}>
                                <AliIcon name={autoPlayTimer?'icon-3':'icon-'} size={50} color='#FFF'></AliIcon>
                            </TouchableNativeFeedback>
                            
                            <TouchableNativeFeedback  >
                                <AliIcon name='icon-1' size={32} color='#FFF'></AliIcon>
                            </TouchableNativeFeedback>
                        </View>
                        <TouchableNativeFeedback  >
                            <AliIcon name='bofangliebiaoicon' size={20} color='#FFF'></AliIcon>
                        </TouchableNativeFeedback>
                    </Row>
                    <WhiteSpace size='sm'/>
                </Grid>
                
            </View>

        );
    }
}



const mapStateToProps = state =>({
    vocaPlay : state.vocaPlay,
});

const mapDispatchToProps = {
    loadTask : vocaPlayAction.loadTask,
    changePlayTimer : vocaPlayAction.changePlayTimer,
    changeCurIndex : vocaPlayAction.changeCurIndex,
    toggleWord : vocaPlayAction.toggleWord,
    toggleTran : vocaPlayAction.toggleTran,
    loadTheme : vocaPlayAction.loadThemes,
    changeTheme : vocaPlayAction.changeTheme,
    changeInterval : vocaPlayAction.changeInterval,
  
};

export default connect(mapStateToProps, mapDispatchToProps)(VocaPlayPage);