import React, { Component } from 'react';
import { StyleSheet,StatusBar, Text, View,ScrollView, Image,TouchableWithoutFeedback} from 'react-native'
import Swiper from 'react-native-swiper';
import {Container, Header, Content, Grid, Row,Col, Icon,Item, Input ,H1, H2, H3, Body, Button} from 'native-base';

import AliIcon from '../../component/AliIcon'
import {bkCover1,turnLogoImg} from '../../image'
import ColBook from '../../component/ColBook'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT =  StatusBar.currentHeight

const styles = StyleSheet.create({
    r_center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center', 
    },
    wrapper:{
    },
    containerStyle:{
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',

    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    bkContainer:{
        width:width/3,
        height:140,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },  
    bkCover:{
        width:90,
        height:120,
    },
    rank:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        width:width/2-40,
        height:60,
        marginHorizontal:20,
        marginVertical:10,
        backgroundColor:'#EFEFEF',
        borderRadius:5,
    },
    desk:{
        width:width,
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    }
})

export default class ReadPage extends Component {

    constructor(props){
        super(props)
        this.state={
            myBooks:[
                {zhName:'汤姆·索亚历险记',zhAuthor:'马克·吐温', enName:'The Adventures of Tom Sawyer', coverUrl:'/xx/xx.jpg',
                intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                {zhName:'80天环游世界',zhAuthor:'马克·吐温', enName:'Le Tour du monde en quatre-vingts jours', coverUrl:'/xx/xx.jpg',
                intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                {zhName:'金银岛',zhAuthor:'罗伯特·路易斯', enName:'Island', coverUrl:'/xx/xx.jpg',
                intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
            ],
            data:[{
                name:'冒险',
                books:[
                    {zhName:'汤姆·索亚历险记',zhAuthor:'马克·吐温', enName:'The Adventures of Tom Sawyer', coverUrl:'/xx/xx.jpg',
                intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                    {zhName:'80天环游世界',zhAuthor:'马克·吐温', enName:'Le Tour du monde en quatre-vingts jours', coverUrl:'/xx/xx.jpg',
                    intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                    {zhName:'金银岛',zhAuthor:'罗伯特·路易斯', enName:'Island', coverUrl:'/xx/xx.jpg',
                    intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                ]
            },{
                name:'爱情',
                books:[
                    {zhName:'汤姆·索亚历险记',zhAuthor:'马克·吐温', enName:'The Adventures of Tom Sawyer', coverUrl:'/xx/xx.jpg',
                    intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                    {zhName:'80天环游世界',zhAuthor:'马克·吐温', enName:'Le Tour du monde en quatre-vingts jours', coverUrl:'/xx/xx.jpg',
                    intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                    {zhName:'金银岛',zhAuthor:'罗伯特·路易斯', enName:'', coverUrl:'/xx/xx.jpg',
                    intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                ]
            }]
        }
    }

    _renderGenres = (item, index)=>{
        console.log(item)
        return <Row style={{marginBottom:20}}>
            <Col>
                {/* 分类名 */}
                <Row style={{
                    flexDirection:'row',
                    justifyContent:'space-between',
                    alignItems:'center',
                    paddingBottom:5
                }}>
                    <H3 style={{marginLeft:13}}>{item.name}</H3>
                    <TouchableWithoutFeedback onPress={()=>{
                        this.props.navigation.navigate('GenreBook',{genreName:item.name})
                    }}>
                        <View style={styles.r_center}>
                            <Text>更多</Text>
                            <AliIcon style={{marginRight:8}} name='youjiantou' size={26} color='#1890FF'/>
                        </View>
                    </TouchableWithoutFeedback>
                </Row>
                {/* 3本书籍 */}
                <Row>
                    <Col >
                        <ColBook book={item.books[0]}/>
                    </Col>
                    <Col >
                        <ColBook book={item.books[1]}/>
                    </Col>
                    <Col>
                        <ColBook book={item.books[2]}/>
                    </Col>
                </Row>
            </Col>
        </Row>
}


  render(){
    const {navigate} = this.props.navigation
    return (
        <Container>
            <StatusBar
                translucent={true}
                // hidden
            />
            <View style={{width:width, height:STATUSBAR_HEIGHT, backgroundColor:'#FDFDFD'}}></View>
            {/* 头部 */}
            <Header translucent noLeft noShadow 
            style={{
                backgroundColor:'#FDFDFD',
                elevation:0,
                borderBottomColor:'#EFEFEF',
                borderBottomWidth:1}}>
                <Body style={{flexDirection:'row',
                justifyContent:'center',
                alignItems:'center',}}>
                    <Text style={{fontSize:16, color:'#1890FF', fontWeight:'500'}}>名著有声书</Text>
                </Body>
            </Header> 
            <Content >
                <Grid>
                    {/* 搜索框 */}
                    <Row style={[styles.r_center, {paddingHorizontal:10, marginVertical:10}]}>
                        <Item searchBar rounded>
                            <Icon name="ios-search" />
                            <Input style={{height:40}} placeholder="Search" />
                        </Item>
                    </Row>
                    {/* 轮播 */}
                    <Row style={[styles.r_center,{marginBottom:20}]}>
                        <Swiper 
                            height={200}
                            style={styles.wrapper}
                            containerStyle={styles.containerStyle}
                            showsButtons={false}
                            // autoplay
                            autoplayTimeout={3}
                            onIndexChanged={(index)=>{console.log(index)}}
                            
                            >
                            <View style={styles.slide1}>
                                <Text style={styles.text}>Hello Swiper</Text>
                            </View>
                            <View style={styles.slide2}>
                                <Text style={styles.text}>Beautiful</Text>
                            </View>
                            <View style={styles.slide3}>
                                <Text style={styles.text}>And simple</Text>
                            </View>
                        </Swiper>
                    </Row>
                    {/* 书桌 */}
                    <Row style={styles.desk}>
                        <View style={{ 
                            flexDirection:'row',
                            justifyContent:'space-between',
                            alignItems:'center',
                            width:width}}>
                            <H3 style={{marginLeft:13}}>书桌</H3>
                            <AliIcon style={{marginRight:8}} name='youjiantou' size={26} color='#1890FF' onPress={()=>{
                                alert('我的书桌')
                            }}/>
                        </View>
                        <ScrollView style={{ flex: 1, }}
                            horizontal={true}
                            // 是否分页
                            pagingEnabled={false}
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            >
                            {
                                this.state.myBooks.map((book, index) =>{
                                    return (
                                    <TouchableWithoutFeedback onPress={()=>{
                                        navigate('BookDetail', {book:book})
                                    }}>
                                        <View style={styles.bkContainer}>
                                            <Image source={bkCover1} style={styles.bkCover} />
                                        </View>
                                    </TouchableWithoutFeedback>)
                                })
                            }
                            
                         
                        </ScrollView>
                    </Row>
                    {/* 分级阅读和人气榜 */}
                    <Row>

                        <TouchableWithoutFeedback onPress={()=>{
                            navigate('LevelBook')
                        }}>
                            <View style={styles.rank}>
                                <AliIcon name='fenjishouquan' size={26} color='#303030'></AliIcon>
                                <Text style={{fontSize:16, color:'#404040'}}>分级阅读</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{
                            navigate('GenreBook',{genreName:'人气榜'})
                        }}>
                            <View style={styles.rank}>
                                <AliIcon name='shouye-cihuiliang' size={26} color='#303030'></AliIcon>
                                <Text style={{fontSize:16, color:'#404040'}}>人气榜</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </Row>



                    {this.state.data &&
                        this.state.data.map(this._renderGenres)
                    }

                </Grid>
            </Content>
        </Container>
        
    );
  }
}