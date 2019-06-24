import React, { Component } from 'react';
import {StatusBar, StyleSheet, Text, View,ScrollView,TouchableOpacity, Image, FlatList} from 'react-native'
import {Container, Header, Content, Grid, Row,Col, Body, Button} from 'native-base';

import AliIcon from '../../component/AliIcon'
import RowBook from '../../component/RowBook'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT =  StatusBar.currentHeight
const HEADER_HEIGHT = 90

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#FDFDFD'
    },
    r_center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center', 
    },
})

export default class GenreBookPage extends Component {

    constructor(props){
        super(props)
        this.state={
            books:[
                {zhName:'汤姆·索亚历险记',zhAuthor:'马克·吐温', enName:'The Adventures of Tom Sawyer', coverUrl:'/xx/xx.jpg',
                intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                {zhName:'80天环游世界',zhAuthor:'马克·吐温', enName:'Le Tour du monde en quatre-vingts jours', coverUrl:'/xx/xx.jpg',
                intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                {zhName:'金银岛',zhAuthor:'罗伯特·路易斯', enName:'Island', coverUrl:'/xx/xx.jpg',
                intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},

                {zhName:'汤姆·索亚历险记',zhAuthor:'马克·吐温', enName:'The Adventures of Tom Sawyer', coverUrl:'/xx/xx.jpg',
                intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                {zhName:'80天环游世界',zhAuthor:'马克·吐温', enName:'Le Tour du monde en quatre-vingts jours', coverUrl:'/xx/xx.jpg',
                intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                {zhName:'金银岛',zhAuthor:'罗伯特·路易斯', enName:'Island', coverUrl:'/xx/xx.jpg',
                intro:'本书是英国小说家罗伯特·路易斯·史蒂文森创作的一部长篇小说，创作于1881年，作品于1881年10月至1882年1月以《金银岛，或伊斯班袅拉号上的暴乱》为题在《小伙子》上发表，作者的署名是“乔治·诺斯船长”，1883年出版单行本。'},
                
                
            ]
        }
    }

    _renderItem = ({item, index})=>{
        console.log(item)
        return <Row style={{marginBottom:20}}>
            <RowBook book={item} feature={'原著/有音频/免费'} showIntro={true}/>
        </Row>
    }


  render(){
    const {navigate,goBack, getParam} = this.props.navigation
    return (
        <Container >
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
                    <Text style={{fontSize:16, color:'#1890FF', fontWeight:'500'}}>{getParam('genreName')}</Text>
                </Body>
            </Header> 
            <Content style={{}}>
                <Grid>
                    <Col size={8}>
                        {this.state.books &&
                            <FlatList
                                // 数据源(数组)
                                data={this.state.books}
                                //渲染列表数据
                                renderItem={this._renderItem}
                                extraData={this.state}
                                keyExtractor={(item,index)=>index}
                               
                            />
                        }
                    </Col>
                </Grid>
                
            </Content>
            
        </Container>
        
    );
  }
}