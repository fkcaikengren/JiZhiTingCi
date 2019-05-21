import React, { Component } from "react";
import {StyleSheet, StatusBar} from 'react-native';
import { Container, Header, Content, Icon, Accordion, Text, View, Body,Title,
    ListItem, Left, Right , Button} from "native-base";
import Picker from 'react-native-picker';
    

import AliIcon from '../component/AliIcon';

const dataArray = [
  { title: "四级词汇", content: [{bookName:'火星四级'}, {bookName:'新东方四级'}] },
  { title: "六级词汇", content: [{bookName:'火星六级'}, {bookName:'新东方六级'}, {bookName:'六级乱序'}, {bookName:'六级正序'}, {bookName:'六级词根词缀'}] },
  { title: "雅思词汇", content: [{bookName:'雅思分类词汇'}, {bookName:'雅思核心词汇'}]  },
  { title: "四级词汇", content: [{bookName:'火星四级'}, {bookName:'新东方四级'}] },
  { title: "六级词汇", content: [{bookName:'火星六级'}, {bookName:'新东方六级'}] },
  { title: "雅思词汇", content: [{bookName:'雅思分类词汇'}, {bookName:'雅思核心词汇'}]  },
  { title: "四级词汇", content: [{bookName:'火星四级'}, {bookName:'新东方四级'}] },
  { title: "六级词汇", content: [{bookName:'火星六级'}, {bookName:'新东方六级'}] },
  { title: "雅思词汇", content: [{bookName:'雅思分类词汇'}, {bookName:'雅思核心词汇'}]  },
  { title: "四级词汇", content: [{bookName:'火星四级'}, {bookName:'新东方四级'}] },
  { title: "六级词汇", content: [{bookName:'火星六级'}, {bookName:'新东方六级'}] },
  { title: "雅思词汇", content: [{bookName:'雅思分类词汇'}, {bookName:'雅思核心词汇'}]  },
];


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    iconText:{
        width:32,
        height:32, 
        backgroundColor:'#C0E5FF', 
        textAlign:'center', 
        lineHeight:32, 
        borderRadius:50,
    }
});


export default class VocaLibPage extends Component {

    _show = ()=>{
        let data = [
            [1,2,3,4,5],    //新学列表数
            [10,11,12,13,14,15,16,17,18,19,20], //列表单词数
        ];
        let selectedValue = [1, 10];

        Picker.init({
            pickerData: data,
            selectedValue: selectedValue,
            pickerTitleText: '新学列表数*列表单词数',
            onPickerConfirm: data => {
                alert(data);
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
        Picker.show();
    }

    _renderHeader = (item, expanded)=> {
        return (
        <View style={[{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center" ,
            padding: 10,
            borderColor:'#F7F7F7'
            },{borderBottomWidth:1}]}>
            <View style={[styles.center,{justifyContent:'flex-start'}]}>
                <Text style={[styles.iconText,{color:'#FFF'}]}>
                    4
                </Text>
                <Text style={{color:'#39668D', fontSize:16, marginLeft:16}}>
                {" "}{item.title}
                </Text>
            </View>
            {expanded
            ? <Icon style={{ fontSize: 18 , alignSelf:'flex-end'}} name="remove-circle" />
            : <Icon style={{ fontSize: 18 , alignSelf:'flex-end'}} name="add-circle" />}
        </View>
        );
    }
    _renderContent = (item)=> {
        return (
        item.content.map((it, index)=>{
            return <View style={{flexDirection: "row", 
            justifyContent: "space-between",
            alignItems: "center" ,
            backgroundColor: "#F7F7F7" ,
            paddingLeft:10,
            paddingVertical:10}} >
                    <Text onPress={()=>{
                        this._show();
                    }}
                    style={{ color:'#77A3F0', fontSize:16 , paddingLeft:30}}>{it.bookName}</Text>
                    <Text style={{ fontSize:16 , color:'#AAAAAA', paddingRight:10}}>3900</Text>
            </View>
        })
        );
    }
    render() {
        

        return (
            <Container>
                <StatusBar
                    translucent={true}
                    // hidden
                />

                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#77A3F0'}}></View>
                {/* 头部 */}
                <Header translucent noLeft noShadow style={{backgroundColor:'#77A3F0', elevation:0,}}>
                    <Button transparent style={{position:'absolute', left:10}}>
                        <AliIcon name='fanhui-copy-copy' size={26} color='#fff' onPress={()=>{
                            this.props.navigation.goBack();
                        }}></AliIcon>
                    </Button>
                    <Body style={{flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',}}>
                        <Title>词汇书库</Title>
                    </Body>
                    
                </Header>
                <Content padder style={{ backgroundColor:'#EFEFEF', }}>
                <Accordion style={{backgroundColor:'#FDFDFD', borderRadius:5}}
                    dataArray={dataArray}
                    animation={true}
                    expanded={true}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                />
                </Content>
            </Container>
        );
    }
}
