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
    levelBar:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
        width:50,
        height:height-STATUSBAR_HEIGHT-HEADER_HEIGHT,
        marginTop:HEADER_HEIGHT,
        backgroundColor:'#FDFDFD',
        position:'absolute',
        left:0,
        height:height-100,
    },
    slideContent:{
        marginLeft:80,
    }
})

export default class LevelBook extends Component {

    constructor(props){
        super(props)
        this.state={
            levels:[{level:1, levelName:'小学'},{level:2, levelName:'初中'},
                {level:3, levelName:'高中'},{level:4, levelName:'四级'},{level:5, levelName:'六级'},
                {level:6, levelName:'考研'},{level:7, levelName:'雅思'},{level:8, levelName:'GRE'}],
            curLevel:4,
            books:[
                {zhName:'汤姆·索亚历险记',zhAuthor:'马克·吐温', enName:'The Adventures of Tom Sawyer', coverUrl:'/xx/xx.jpg'},
                {zhName:'80天环游世界',zhAuthor:'马克·吐温', enName:'Le Tour du monde en quatre-vingts jours', coverUrl:'/xx/xx.jpg'},
                {zhName:'金银岛',zhAuthor:'罗伯特·路易斯', enName:'Island', coverUrl:'/xx/xx.jpg'},
                {zhName:'汤姆·索亚历险记',zhAuthor:'马克·吐温', enName:'The Adventures of Tom Sawyer', coverUrl:'/xx/xx.jpg'},
                {zhName:'80天环游世界',zhAuthor:'马克·吐温', enName:'Le Tour du monde en quatre-vingts jours', coverUrl:'/xx/xx.jpg'},
                {zhName:'金银岛',zhAuthor:'罗伯特·路易斯', enName:'Island', coverUrl:'/xx/xx.jpg'},
            ]
        }
    }

    _renderItem = ({item, index})=>{
        console.log(item)
        return <Row style={{marginBottom:20}}>
            <RowBook book={item}/>
        </Row>
    }


  render(){
    const {navigate,goBack} = this.props.navigation
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
                    <Text style={{fontSize:16, color:'#1890FF', fontWeight:'500'}}>分级读物</Text>
                </Body>
            </Header> 
            <Content style={styles.slideContent}>
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
           
            {/*侧面的等级导航栏 */}
            <View style={styles.levelBar}>
                    {this.state.levels &&
                        this.state.levels.map((item, index)=>{
                            slectedStyle={
                                color:'#606060'
                            }
                            if(index+1 == this.state.curLevel){
                                slectedStyle.color='#1890FF'
                                
                            }
                            return <TouchableOpacity>
                                 <View key={index} style={{
                                        flexDirection:'column',
                                        justifyContent:'center',
                                        alignItems:'center',
                                        height:50
                                    }}>
                                    <Text style={[slectedStyle,]}>{item.levelName}</Text>
                                </View>
                            </TouchableOpacity>
                           
                        })
                    }
                </View>

            
        </Container>
        
    );
  }
}