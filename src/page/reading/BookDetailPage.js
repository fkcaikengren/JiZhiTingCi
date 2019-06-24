import * as React from 'react';
import { StatusBar, StyleSheet, Animated, View, FlatList , Text, Image} from "react-native";
import {Container, Header, Content, Grid, Row,Col,H3, Icon, Body, Button, 
    Footer, FooterTab,} from 'native-base';


import {turnLogoImg} from '../../image'
import StickyHeader from '../../component/StickyHeader'
import RowBook from '../../component/RowBook'
import AliIcon from '../../component/AliIcon'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT =  StatusBar.currentHeight

const styles = StyleSheet.create({

    r_start:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    l_start:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    userIcon:{
        width:30,
        height:30,
        borderRadius:20,
    },
    top:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FDFDFD'
    },
    between:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    label:{
        fontSize:12,
        color:'#404040',
        lineHeight:18,
        paddingHorizontal:5,
        borderRadius:20,
        marginLeft:5,
        backgroundColor:'#f7cffc',
        marginVertical:4,
    },
    intro:{
        fontSize:14,
        color:'#404040',
        lineHeight:20,
    },
    commentBar:{
        lineHeight:30,
        width:width, 
        backgroundColor:'#FDFDFD', 
        paddingLeft:10,
        color:'#404040'
    },
    userComment: {
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        paddingTop:10,
        paddingLeft:10
        
    },
    userRight:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        width:'100%' , 
        borderBottomColor:'#EFEFEF', 
        borderBottomWidth:1, 
        paddingLeft:10,
        paddingBottom:10
    }
});

/**
 *Created by Jacy on 19/06/24.
 */
export default class BookDetailPage extends React.Component {


    

    constructor(props){
        super(props);
         // 在页面constructor里声明state
        this.state = {
            scrollY: new Animated.Value(0),
            headHeight:-1,
            dataSource:[
                {
                    avatarUrl:'xx/xx',
                    nickname:'Jacy',
                    comment:'很不错的一本书',
                    publishTime:'2019-06-22'
                },
                {
                    avatarUrl:'xx/xx',
                    nickname:'Biubiu',
                    comment:'很不错的一本书很不错的一本书很不错的一本书很不错的一本书',
                    publishTime:'2019-03-12'
                },{
                    avatarUrl:'xx/xx',
                    nickname:'非要气泡',
                    comment:'很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书',
                    publishTime:'2019-02-22'
                },{
                    avatarUrl:'xx/xx',
                    nickname:'非要气泡',
                    comment:'很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书',
                    publishTime:'2019-02-22'
                },{
                    avatarUrl:'xx/xx',
                    nickname:'非要气泡',
                    comment:'很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书',
                    publishTime:'2019-02-22'
                },{
                    avatarUrl:'xx/xx',
                    nickname:'非要气泡',
                    comment:'很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书',
                    publishTime:'2019-02-22'
                },
                {
                    avatarUrl:'xx/xx',
                    nickname:'Biubiu',
                    comment:'很不错的一本书很不错的一本书很不错的一本书很不错的一本书',
                    publishTime:'2019-03-12'
                },{
                    avatarUrl:'xx/xx',
                    nickname:'非要气泡',
                    comment:'很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书',
                    publishTime:'2019-02-22'
                },{
                    avatarUrl:'xx/xx',
                    nickname:'非要气泡',
                    comment:'很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书',
                    publishTime:'2019-02-22'
                },{
                    avatarUrl:'xx/xx',
                    nickname:'非要气泡',
                    comment:'很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书',
                    publishTime:'2019-02-22'
                },{
                    avatarUrl:'xx/xx',
                    nickname:'非要气泡',
                    comment:'很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书很不错的一本书',
                    publishTime:'2019-02-22'
                }
            ]
        };
        
    }


    _renderItem = ({item, index})=>{
        return (
            <View style={styles.userComment}>
                <View >
                    <Image source={turnLogoImg}  style={styles.userIcon}/>
                </View>
                <View style={styles.userRight}>
                    <Text style={{fontSize:12, color:'#303030'}}>{item.nickname}</Text>
                    <Text style={{fontSize:10, color:'#AAA'}}>{item.publishTime}</Text>
                    <Text style={{fontSize:12, color:'#303030'}}>{item.comment}</Text>
                </View>
            </View>
        )
    }


    render(){
        const {goBack, navigate, getParam} = this.props.navigation
        const book = getParam('book')
        return(
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
                <Button transparent style={{position:'absolute', left:10}}>
                    <AliIcon name='fanhui' size={26} color='#1890FF' onPress={()=>{
                        goBack();
                    }}></AliIcon>
                </Button>
                <Body style={{flexDirection:'row',
                justifyContent:'center',
                alignItems:'center',}}>
                    <Text style={{fontSize:16, color:'#1890FF', fontWeight:'500'}}>分级读物</Text>
                </Body>
            </Header> 


            <Animated.ScrollView 
                style={{ flex: 1 }}
                onScroll={
                Animated.event(
                    [{
                    nativeEvent: { contentOffset: { y: this.state.scrollY } } // 记录滑动距离
                    }],
                    { useNativeDriver: true }) // 使用原生动画驱动
                }
                scrollEventThrottle={1}
            >
                {/* 上部分 */}
                <View onLayout={(e) => {
                let { height } = e.nativeEvent.layout;
                this.setState({ headHeight: height }); 
                }}>
                    <View style={styles.top}>
                        {/* 书单封面 */}
                        <RowBook book={book} containerStyle={{borderBottomColor:'#EFEFEF', borderBottomWidth:1}}/>
                        {/* 简介 */}
                        <View style={{
                            flexDirection:'column',
                            justifyContent:'center',
                            alignItems:'center',
                            width: width-20,
                            marginTop:10,
                            marginBottom:12,
                        }}>
                            <View style={[styles.between,{width:'100%',borderBottomWidth:1, borderBottomColor:'#EFEFEF'}]}>
                                <Text>简介</Text>
                                <Text>极致英语</Text>
                            </View>
                            <View>
                                <Text style={styles.intro}>{book.intro}</Text>
                            </View>
                            <View style={[styles.r_start, {width:'100%',}]}>
                                <Text style={styles.label}>高中</Text>
                                <Text style={[styles.label, {backgroundColor:'#fde33d'}]}>小说</Text>
                                <Text style={[styles.label, {backgroundColor:'#ccffee'}]}>冒险</Text>
                            </View>
                        </View>
                        {/* 分割条 */}
                        <View style={{
                            width:width, height:10,backgroundColor:'#EFEFEF'
                            }}>
                        </View>
                    </View>
                </View>
                
                <StickyHeader
                stickyHeaderY={this.state.headHeight} // 把头部高度传入
                stickyScrollY={this.state.scrollY}  // 把滑动距离传入
                >
                {/*第二部分组件 */}
                <Text style={styles.commentBar}>书评(234)</Text>
                </StickyHeader>
                
                {/*三部分的列表组件 */}
                <FlatList
                data={this.state.dataSource}
                renderItem={this._renderItem}
                extraData={this.props}
                />
                
            </Animated.ScrollView>
    
            <Footer>
            <FooterTab style={{backgroundColor:'#FDFDFD'}}>
                <Button>
                    <Text style={{
                        color:'#404040',
                    }}>加入书桌</Text>
                </Button>
                <Button >
                    <Text style={{
                        color:'#1890FF',
                        paddingHorizontal:20, 
                        paddingVertical:6,
                        backgroundColor:'#1890FF66',
                        borderRadius:3,
                        }}>预习生词</Text>
                </Button>
                <Button >
                    <Text style={{
                        color:'#FFF',
                        paddingHorizontal:20, 
                        paddingVertical:6,
                        backgroundColor:'#1890FF',
                        borderRadius:3,
                        }}>免费阅读</Text>
                </Button>
            </FooterTab>
            </Footer>
            </Container>   
        )
    }
}

