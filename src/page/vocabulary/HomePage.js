import React, { Component } from 'react';
import {View, StyleSheet,Image, FlatList, TouchableOpacity} from 'react-native';
import { Container, Header,Content,  Grid, Col, Row,
    Icon ,Button,Text,Left,Right, Body, Footer,ListItem } from 'native-base';
import * as Progress from 'react-native-progress';
import {connect} from 'react-redux';
import * as VocaPlayAction from '../../action/vocabulary/vocaPlayAction';
import * as VocaGroupAction from '../../action/vocabulary/vocaGroupAction'
import * as VocaLibAction from '../../action/vocabulary/vocaLibAction'


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
        this.state = {
            data:  [
                {type:'header', name:''},
                {type:'title', name:'今日新学'},
                {type:'newLearn', listID:4, isCompleted:true}, 
                {type:'newLearn', listID:5, isCompleted:false}, 
                {type:'newLearn', listID:6, isCompleted:false},
                {type:'title', name:'今日复习'},
                {type:'todayReview1', listID:4, isLocked:false, isCompleted:true}, 
                {type:'todayReview1', listID:5, isLocked:true, isCompleted:false}, 
                {type:'todayReview1', listID:6, isLocked:true, isCompleted:false},
                {type:'todayReview2', listID:4, isLocked:false, isCompleted:true}, 
                {type:'todayReview2', listID:5, isLocked:false, isCompleted:false}, 
                {type:'todayReview2', listID:6, isLocked:false, isCompleted:false},
                {type:'title', name:'往日回顾'},
                {type:'pastReview', listID:1, isCompleted:true}, 
                {type:'pastReview', listID:2, isCompleted:false}, 
                {type:'pastReview', listID:3, isCompleted:false}
            ],
            stickyHeaderIndices: [0, 1, 5, 12],
        };
      }

    _renderItem = ({ item, index }) => {
        const {loadVocaGroups, loadVocaBooks} = this.props;
        let bodyStyle = {};
        let buttonContent = {color:'#1890FF', fontSize:14, fontWeight:'500'};
        let iconName = 'square-o';
        let iconStyle = {color:'#1890FF'};
        let buttonName = '开始';
        
        if(item.isCompleted==true){
            bodyStyle = {textDecorationLine:'line-through'}
            iconName = 'check-square';
            iconStyle = {color:'#1890FF'};
            buttonName = '已完成';
        }
    
        let note = '';
        switch(item.type){
            case 'newLearn':
                note = '约10min可完成'; break;
            case 'todayReview1':
                note = '建议3min后复习'; break;
            case 'todayReview2':
                note = '建议12h后复习'; break;
            case 'pastReview':
                note = '约12min可完成'; break;
            default:
                break;
        }
        if(item.type == 'header'){
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
        }else if(item.type == 'title') {
          return (
            //分类头
            <View style={{backgroundColor:'#FDFDFD', paddingLeft:15, paddingVertical:15}}>
              <Text style={{ color:'#2D4150', fontSize:16, fontWeight:'500'}}>
                {item.name}
              </Text>
            </View>          
          
            
          );
        } else{
          return (
              //任务列表项
            <ListItem  thumbnail style={{ padding:0}}>
                <Left >
                    <Icon type='FontAwesome' name={iconName} size={30} style={[iconStyle]}/>
                </Left>
                <Body >
                    <Text style={[{ color:'#2D4150', fontSize:14, fontWeight:'500'}]}>学习List{item.listID}</Text>
                    <Text note numberOfLines={1} >{note}</Text>
                </Body>
                <Right>
                    <Button rounded style={styles.listButton} onPress={()=>{
                      //跳转到卡片学习页面
                      this.props.navigation.navigate('LearnCard');
                    }}>
                        <Text style={[buttonContent]}>{buttonName}</Text>
                    </Button>
                </Right>
            </ListItem>
          );
        }
      };



    render() {
    let {loadPlayWordList} = this.props;
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
                            data={this.state.data}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            stickyHeaderIndices={this.state.stickyHeaderIndices}
                        />
                    </Col>
                </Grid>
            </Content>

            <Footer style={{backgroundColor:'#FFF'}} >
                <Grid >
                <TouchableOpacity
                    style={styles.touch}
                    onPress={()=>{
                        loadPlayWordList();
                        this.props.navigation.navigate('VocaPlay');
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
    home:state.home,
});

const mapDispatchToProps = {
    loadPlayWordList: VocaPlayAction.loadList,
    loadVocaGroups : VocaGroupAction.loadVocaGroups,
    loadVocaBooks : VocaLibAction.loadVocaBooks,
};


export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

