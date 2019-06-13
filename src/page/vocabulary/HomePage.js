import React, { Component } from 'react';
import {View, StyleSheet,Image, FlatList, TouchableOpacity} from 'react-native';
import { Container, Header,Content,  Grid, Col, Row,
    Icon ,Button,Text,Left,Right, Body, Footer,ListItem } from 'native-base';
import * as Progress from 'react-native-progress';
import {connect} from 'react-redux';
import * as VocaPlayAction from '../../action/vocabulary/vocaPlayAction';
import * as VocaGroupAction from '../../action/vocabulary/vocaGroupAction'
import * as VocaLibAction from '../../action/vocabulary/vocaLibAction'
import * as HomeAtion from '../../action/vocabulary/homeAction'
import * as LearnNewAction from '../../action/vocabulary/learnNewAction'
import {IN_PLAY , IN_CARD , IN_TEST1 , IN_RETEST1 , IN_TEST2, IN_RETEST2, PLAY_LEARN,  PLAY_REVIEW} from '../../constant'


import AliIcon from '../../component/AliIcon';
import {turnLogoImg} from '../../image';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    header:{
        backgroundColor:'#FDFDFD',
        elevation:0,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:20,
        
    },
    title:{
        fontSize:24,
        fontWeight:'500',
        color:'#1890FF',
    },
    center:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center',
    },

    bookName:{
        fontSize: 18,
        color: '#101010',
    },
    learnedNum:{
        fontSize: 14,
        color: '#101010'
    },
    searchBtn:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor: '#F0F0F0',
        paddingVertical: 1,
        paddingHorizontal: 10,
        borderRadius: 100,
    },
    listButton : {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        color:'#1890FF', 
        backgroundColor:'#1890FF22', 
        width:60, 
        elevation:0,
        borderWidth:0,
    
      },
      c_center:{
        flexDirection:'column', 
        justifyContent:'center',
        alignItems:'center',
      },
    basicFont:{
        fontSize:14, 
        color:'#101010'
    }
});

class HomePage extends Component {

    constructor(props) {
        super(props);
       
      }

    componentDidMount(){
        const {loadTaskLists, } = this.props
        loadTaskLists();
    }


    //根据任务处于哪一学习阶段，跳到指定页面
    _startSelection(task){
        const { loadLearnList} = this.props;
        const {navigate} = this.props.navigation
         //根据learnStatus 判断处于哪一学习阶段
         if(task.learnStatus === IN_PLAY){          //单词轮播页面
            //加载学习单词列表
            loadLearnList()
            navigate('VocaPlay', {playMode:PLAY_LEARN});
        }else if(task.learnStatus === IN_CARD){  //跳转到卡片学习页面
            navigate('LearnCard');
        }else if(task.learnStatus === IN_TEST1){ //跳转到测试1 页面
            navigate('TestEnTran');
        }
    }

    //开始任务
    _start = (item)=>{
        const { loadTask} = this.props;
        const {task} = this.props.learnNew
         //默认task为{},若learnStatus不存在 首次加载任务数据
         if(!task.learnStatus){
            loadTask(item.taskOrder)
            .then(action =>{
                this._startSelection(action.payload.task);
                
                // console.log('判断是否改变状态后，才返回');
                // console.log(task);          //这个时候还没有dispatch, 当then结束后才dispatch
            })
        }else{
            this._startSelection(task);
        }

         
       
    }

    _renderItem = ({ item, index }) => {
        const {loadVocaGroups, loadVocaBooks, loadTask} = this.props;

        let bodyStyle = {};
        let buttonContent = {color:'#1890FF', fontSize:14, fontWeight:'500'};
        let iconName = 'square-o';
        let iconStyle = {color:'#1890FF'};
        let buttonName = '开始';
        
        if(item.finished == true){
            bodyStyle = {textDecorationLine:'line-through'}
            iconName = 'check-square';
            iconStyle = {color:'#1890FF'};
            buttonName = '已完成';
        }

        let type='item' //menu, header, item
        let note = '';

        if(index == 0){
            return (
                //菜单
                <Grid style={{height:155,}}>
                    <Row style={[styles.c_center,{height:60}]}>
                        <View style={{
                            flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center', width: width-40,
                        }}>
                            <Text style={styles.bookName}>六级顺序词汇书</Text>
                            <Text style={styles.basicFont}>已掌握34/2300</Text>
                        </View>
                        <View style={[styles.center,]}>
                            <Progress.Bar progress={0.3} height={3} width={width-40} color='#F6B056' unfilledColor='#F4F4F4' borderWidth={0} />
                        </View>
                    
                    </Row>
                    
                    
                    <Row style={[styles.center, { height:width/4}]}>
                        {/* 单词书库 */}
                        <Col style={[styles.c_center,{ width:width/4}]} onPress={()=>{
                                loadVocaBooks();
                                this.props.navigation.navigate('VocaLib');
                            }}>
                            <AliIcon name='icon-test' size={26} color='#F2B055' ></AliIcon>
                            <Text style={styles.basicFont}>单词书库</Text>
                        </Col>
                        {/* 单词列表 */}
                        <Col style={[styles.c_center,{ width:width/4}]}  onPress={()=>{
                                this.props.navigation.navigate('VocaList');
                            }}>
                            <AliIcon name='ai-list' size={26} color='#EB746E'></AliIcon>
                            <Text style={styles.basicFont}>单词列表</Text>
                        </Col>
                        {/* 生词本 */}
                        <Col style={[styles.c_center,{width:width/4}]} onPress={()=>{
                                loadVocaGroups();
                                this.props.navigation.navigate('VocaGroup');
                            }}>
                            <AliIcon name='edit' size={26} color='#66CAA3'></AliIcon>
                            <Text style={styles.basicFont}>生词本</Text>
                        </Col>
                        <Col style={[styles.c_center,{width:width/4}]} onPress={()=>{
                                this.props.navigation.navigate('Statistics');
                            }}>
                            <AliIcon name='rili' size={26} color='#D572E0'></AliIcon>
                            <Text style={styles.basicFont}>学习统计</Text>
                        </Col>
                    </Row>
                    <Row style={{width:width, height:6, backgroundColor:'#EFEFEF'}}>

                    </Row>
                </Grid>
            );
        }else{
            if(item.status==-1){
                type = 'header'
            }else if(item.status==0){
                
            }else if(item.status==10 || item.status==11 || item.status==12){

            }else if(item.status==22 || item.status==24 || item.status==27 || item.status==215){

            }else if(item.status==200){

            }else{
                console.log('taskList的status不对')
                type=''
            }

            if (type === 'header') {
            return (
                //分类头
                <View style={{backgroundColor:'#FDFDFD', paddingLeft:15, paddingVertical:15}}>
                <Text style={{ color:'#2D4150', fontSize:16, fontWeight:'500'}}>
                    {item.title}
                </Text>
                </View>          
            );
            } else if(type === "item"){
                return (
                    //任务列表项
                    <ListItem  thumbnail style={{ padding:0}}>
                        <Left >
                            <Icon type='FontAwesome' name={iconName} size={30} style={[iconStyle]}/>
                        </Left>
                        <Body >
                            <Text style={[{ color:'#2D4150', fontSize:14, fontWeight:'500'}]}>学习List{item.taskOrder}</Text>
                            <Text note numberOfLines={1} >{note}</Text>
                        </Body>
                        <Right>
                            <Button rounded style={styles.listButton} onPress={()=>{this._start(item)}}>
                                <Text style={[buttonContent]}>{buttonName}</Text>
                            </Button>
                        </Right>
                    </ListItem>
                );
            }

        }

    
        
      };

    render() {
        const {taskList, stickyHeaderIndices} = this.props.home;
        const {loadReviewList, loadTask} = this.props;
        
        return (
            <Container style={{ backgroundColor: '#FDFDFD',}}> 

                {/* 头部 */}
                <Header style={styles.header}>
                    <Text style={styles.title}>极致英语</Text>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('VocaSearch', { transition: 'forHorizontal' });}}>
                        <View style={styles.searchBtn} >
                            <Icon name='search'  style={{color:'#303030', fontSize:20, paddingRight:5}}></Icon>
                            <Text style={{color:'#909090'}}>查词</Text>
                        </View>
                    </TouchableOpacity>
                    
                        
                </Header>
            
                <Content >
                    {/* 首页菜单和任务列表 */}
                    <Grid style={{height:440}}>
                        <Col>
                            <FlatList
                                data={taskList}
                                renderItem={this._renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                stickyHeaderIndices={stickyHeaderIndices}
                            />
                        </Col>
                    </Grid>
                </Content>

                <Footer style={{backgroundColor:'#FFF'}} >
                    <Grid >
                    <TouchableOpacity
                        style={styles.touch}
                        onPress={()=>{      //播放
                            if(!this.props.vocaPlay.isDataLoaded){ //没有数据则加载
                                loadReviewList();
                            }
                            this.props.navigation.navigate('VocaPlay',{playMode:PLAY_REVIEW});
                        }}
                        activeOpacity={0.7}
                            >
                        <Col style={{width:70, height:50, }}>
                            <Row style={styles.center}>
                                <Image style={{width:50, height:50, borderRadius:50}} source={turnLogoImg} />
                            </Row>
                        
                        </Col>
                    </TouchableOpacity>
                        <Col>
                            <Row size={1}>
                                <View style={[styles.center,{alignItems:'flex-end'}]}>
                                    <Progress.Bar progress={0.3} height={2} width={280} color='#1890FF' unfilledColor='#DEDEDE' borderWidth={0}/>
                                </View>
                            </Row>
                            <Row size={4} style={{
                                flexDirection:'row',
                                justifyContent:'space-between',
                                alignItems:'center',}}>
                                <View >
                                    <Text style={{fontSize:16, color:'#1890FF'}}>List-001</Text>
                                </View>
                                <View style={{
                                    flexDirection:'row',
                                    justifyContent:'flex-end',
                                    alignItems:'center',
                                }}>
                                    <AliIcon name='bofang1' size={22} color='#1890FF' style={{paddingRight:20}}></AliIcon>
                                    <AliIcon name='xiayige' size={20} color='#1890FF'  style={{paddingRight:20}}></AliIcon>
                                    <AliIcon name='bofangliebiaoicon' size={20} color='#1890FF'  style={{paddingRight:10}}></AliIcon>
                                </View>
                                
                            </Row>
                        </Col>
                    </Grid>
                </Footer>
            </Container>
        
        );
  }
}



const mapStateToProps = state =>({
    home : state.home,
    learnNew : state.learnNew,
    vocaPlay : state.vocaPlay,
});

const mapDispatchToProps = {
    loadReviewList: VocaPlayAction.loadReviewList,
    loadLearnList : VocaPlayAction.loadLearnList,
    loadVocaGroups : VocaGroupAction.loadVocaGroups,
    loadVocaBooks : VocaLibAction.loadVocaBooks,
    loadTaskLists : HomeAtion.loadTaskLists,
    loadTask: LearnNewAction.loadTask,

};


export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

