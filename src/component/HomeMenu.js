
import React from "react";
import { FlatList, View , Text, StyleSheet} from "react-native";
import { ListItem,Container, Header, Left, Body, Right,Content, Title, Grid, Col, Row,
    Badge ,Icon ,Button, Footer,Drawer } from 'native-base';
import * as Progress from 'react-native-progress';
import AliIcon from './AliIcon';


  
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

/**
 *Created by Jacy on 19/05/19.
 */
export default class Menu extends React.Component {
    constructor(props){
      super(props);
      this.state={}
    }
    render(){
      return(
        <Grid style={{height:155,}}>
            <Row style={{flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
            height:60}}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: width-40,
                }}>
                    <Text style={styles.bookName}>六级顺序词汇书</Text>
                    <Text style={styles.basicFont}>已掌握34/2300</Text>
                </View>
                <View style={[styles.center,]}>
                    <Progress.Bar progress={0.3} height={3} width={width-40} color='#F6B056' unfilledColor='#F4F4F4' borderWidth={0} />
                </View>
            
            </Row>
            
            
            
            <Row style={[ { height:width/4}]}>
                <Col style={{
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                    width:width/4}} onPress={()=>{
                        this.props.navigation.navigate('VocaLib');
                    }}>
                    <AliIcon name='icon-test' size={26} color='#F2B055' ></AliIcon>
                    <Text style={styles.basicFont}>单词书库</Text>
                </Col>
                <Col style={{
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                    width:width/4}}  onPress={()=>{
                        this.props.navigation.navigate('VocaList');
                    }}>
                    <AliIcon name='ai-list' size={26} color='#EB746E'></AliIcon>
                    <Text style={styles.basicFont}>单词列表</Text>
                </Col>
                <Col style={{
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                    width:width/4}}>
                    <AliIcon name='edit' size={26} color='#66CAA3'></AliIcon>
                    <Text style={styles.basicFont}>我的单词</Text>
                </Col>
                <Col style={{
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                    width:width/4}} onPress={()=>{
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
    }
  }
  const styles = StyleSheet.create({
    center:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center',
    },
  
    bookName:{
        fontSize: 18,
        color: '#101010',
    },
    basicFont:{
        fontSize:14, 
        color:'#101010'
    }

  });