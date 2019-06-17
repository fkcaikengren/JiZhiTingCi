import React, { Component } from 'react';
import {View, StyleSheet,Image, FlatList, TouchableOpacity} from 'react-native';
import { Container, Header,Content,  Grid, Col, Row,
    Icon ,Button,Text,Left,Right, Body, Footer,ListItem } from 'native-base';
import * as Progress from 'react-native-progress';

import Ionicons from 'react-native-vector-icons'


import VocaDao from '../../dao/vocabulary/VocaDao'
import VocaTaskDao from '../../dao/vocabulary/VocaTaskDao'
import * as Constant from '../../constant'


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

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {data:[{type:'menu', titile:null, task:null}]}
        this.vocaDao = new VocaDao()
        this.taskDao = new VocaTaskDao()
    }

    componentDidMount(){
        this.vocaDao.open()     //打开单词数据库
        this.taskDao.open()     //打卡任务数据库
        .then(()=>{
            //先存一部分数据（测试）
            // this.taskDao.deleteAllTasks()
            // this.taskDao.saveVocaTasks([])
            this._loadData()
        })
    }

    componentWillUnmount(){
        alert('Home out, realm close')
        this.vocaDao.close()
        this.taskDao.close()
    }


    //同步加载数据（同时格式化处理）
    _loadData = ()=>{
        let data = [{type:'menu', titile:null, task:null}];
        let indices = [0]
        //获取今日新学任务
        data.push({type:'header', titile:'今日新学', task:null})
        indices.push(data.length-1)
        let learnTasks = this.taskDao.getLearnTasks()
        console.log('learnTasks:')
        console.log(learnTasks)
        for(let task of learnTasks){
            data.push({type:'task', titile:null, task:task, flag:1})  //今日新学任务（一直存在）
        }
        data.push({type:'header', titile:'新学复习', task:null})
        indices.push(data.length-1)
        for(let task of learnTasks){
            if(task.learnStatus !== 'LEARN_FINISH'){ //锁定
                data.push({type:'task', titile:null, task:task, locked:true, flag:2})
            }else{//未锁，可复习
                data.push({type:'task', titile:null, task:task, locked:false, flag:2})
            }
        }
        
        //获取复习任务
        data.push({type:'header', titile:'往日回顾', task:null})
        indices.push(data.length-1)
        let reviewTasks = this.taskDao.getReviewTasks()
        console.log('reviewTasks:')
        console.log(reviewTasks)
        for(let task of reviewTasks){
            data.push({type:'task', titile:null, task:task, flag:3})
        }
        // 初始化
        this.stickyHeaderIndices = indices
        this.setState({data:data, })
    }

    //开始任务
    _start = (task)=>{
        console.log('go:')
        console.log(task)
        const {navigate} = this.props.navigation
        //根据learnStatus 判断处于哪一学习阶段
        let goalPage = ''
        
        if(task.learnStatus === 'IN_LEARN_CARD'){            //跳转到卡片学习页面
            goalPage = 'LearnCard'
        }else if(task.learnStatus === 'IN_LEARN_TEST1'){    //跳转到测试1 页面
            goalPage = 'TestEnTran'
        }
        if(goalPage.length > 0){
                navigate(goalPage, {taskDao:this.taskDao, taskOrder:task.taskOrder, vocaDao: this.vocaDao});
        }
    }

    _renderItem = ({ item, index }) => {

        

        let display = 'normal' //['normal', 'locked', 'finished']
        switch(item.flag){
            case 1:
                if(item.task && item.task.learnStatus === 'LEARN_FINISH'){
                    display = 'finished'
                }
            break;
            case 2:
                if(item.locked && item.locked==true){
                    display = 'locked'
                }
                if(item.task && item.task.reviewStatus === 'REVIEW_FINISH'){
                    display = 'finished'
                }
            break;
            case 3:
                if(item.task && item.task.reviewStatus === 'REVIEW_FINISH'){
                    display = 'finished'
                }
            break;
        }
        
        if(item.locked !== undefined){  //复习

            if(item.locked==true){
                display = 'locked'
            }
        }
        

        let note = ''
        //菜单
        if(item.type === 'menu'){
            return (
                <Grid  style={{height:155,}}>
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
        } else if (item.type === 'header') {
            return (
                <View style={{backgroundColor:'#FDFDFD', paddingLeft:15, paddingVertical:15}}>
                    <Text style={{ color:'#2D4150', fontSize:16, fontWeight:'500'}}>
                        {item.titile}
                    </Text>
                </View> 
                        
            );
        } else if(item.type === "task"){
            if(display === 'locked'){      //锁定的
                return(
                    <ListItem  thumbnail style={[{ padding:0}]}>
                        <Left >
                            <Icon type='FontAwesome' name='square-o' size={30} style={{color:'#AAAAAA'}}/>
                        </Left>
                        <Body >
                            <Text style={[{ color:'#AAAAAA', fontSize:14, fontWeight:'500'}]}>List{item.task.taskOrder}</Text>
                            <Text note numberOfLines={1} >{note}</Text>
                        </Body>
                        <Right>
                            <Icon type='FontAwesome' name='lock' size={30} color='#AAAAAA'/>
                        </Right>
                    </ListItem>
                )
                
            }else if(display === 'finished'){     //已完成的
                return(
                        <ListItem  thumbnail style={[{ padding:0}]}>
                            <Left >
                                <Icon type='FontAwesome' name='check-square' size={30} style={{color:'#1890FF'}}/>
                            </Left>
                            <Body >
                                <Text style={[{ color:'#303030', fontSize:14, fontWeight:'500', 
                                    textDecorationLine:'line-through', textDecorationColor:'#000000'}]}>
                                    List{item.task.taskOrder}
                                </Text>
                                <Text note numberOfLines={1} >{note}</Text>
                            </Body>
                            <Right>
                                <Button rounded transparent disabled>
                                    <Text style={{fontSize:16, fontWeight:'500', color:'#1890FF'}}>
                                        完成
                                    </Text>
                                </Button>
                            </Right>
                        </ListItem>
                )
            }else{        //正常的
                return(
                        <ListItem  thumbnail style={[{ padding:0}]}>
                            <Left >
                                <Icon type='FontAwesome' name='square-o' size={30} style={{color:'#1890FF'}}/>
                            </Left>
                            <Body >
                                <Text style={[{ color:'#303030', fontSize:14, fontWeight:'500'}]}>List{item.task.taskOrder}</Text>
                                <Text note numberOfLines={1} >{note}</Text>
                            </Body>
                            <Right>
                                <Button rounded style={{backgroundColor:'#1890FF33', elevation:0}} onPress={()=>{
                                    this._start(item.task)
                                }}>
                                    <Text style={{fontSize:16, fontWeight:'500', color:'#1890FF'}}>
                                        开始
                                    </Text>
                                </Button>
                            </Right>
                        </ListItem>
                )
            }
        }
           
        
      };

    render() {
        console.log(this.state.data)
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
                    <View style={{ height:450}}>
                            <FlatList
                                data={this.state.data}
                                renderItem={this._renderItem}
                                // extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                // stickyHeaderIndices={this.stickyHeaderIndices}
                            />

                    </View>
                </Content>

                <Footer style={{backgroundColor:'#FFF'}} >
                    <Grid >
                    <TouchableOpacity
                        style={styles.touch}
                        onPress={()=>{      //播放
                            this.props.navigation.navigate('VocaPlay',{playMode:'PLAY_REVIEW', taskDao:this.taskDao});
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


