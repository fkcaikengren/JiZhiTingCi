import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text} from 'react-native';
import { Container, Header, Content, Icon, Accordion,Body,Title,
    ListItem, Left, Right , Button} from "native-base";
import Picker from 'react-native-picker';
import {connect} from 'react-redux';


import * as VocaLibAction from '../../action/vocabulary/vocaLibAction'
import AliIcon from '../../component/AliIcon';


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#EFEFEF'
    },
    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    c_center:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    iconText:{
        width:32,
        height:32, 
        backgroundColor:'#1890FF', 
        textAlign:'center', 
        lineHeight:32, 
        borderRadius:50,
    },
    planBook:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#FDFDFD',
        borderRadius:5,
        marginTop:10,
        padding:5,
    }
});


class VocaLibPage extends Component {

    constructor(props){
        super(props)
    }

    componentDidMount(){
        //加载数据
        const {loadVocaBooks} = this.props
        loadVocaBooks()
    }

    _show = (name)=>{
        const {changeVocaBook} = this.props
        let data = [
            [1,2,3,4,5],    //新学列表数
            [10,11,12,13,14,15,16,17,18,19,20], //列表单词数
        ];
        let selectedValue = [1, 10];

        Picker.init({
            pickerData: data,
            selectedValue: selectedValue,
            pickerTitleText: name,
            onPickerConfirm: data => {
                const {listCount,listWordCount} = data;
                changeVocaBook(name, listCount,  listWordCount);
                alert('恭喜你，计划设置成功');
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
                    {item.section[0]}
                </Text>
                <Text style={{color:'#303030', fontSize:16, marginLeft:16, fontWeight:'500'}}>
                {" "}{item.section}
                </Text>
            </View>
            {expanded
            ? <AliIcon name='youjiantou-copy' size={26} color='#A0A0A0'></AliIcon>
            : <AliIcon name='youjiantou' size={26} color='#A0A0A0'></AliIcon>}
        </View>
        );
    }
    _renderContent = (item)=> {
        return (
        item.books.map((it, index)=>{
            return <View key={index} style={{flexDirection: "row", 
            justifyContent: "space-between",
            alignItems: "center" ,
            backgroundColor: "#F7F7F7" ,
            paddingLeft:10,
            paddingVertical:10}} >
                    <Text onPress={()=>{
                        this._show(it.name);
                    }}
                    style={{ color:'#39668D', fontSize:16 , paddingLeft:30}}>{it.name}</Text>
                    <Text style={{ fontSize:16 , color:'#AAAAAA', paddingRight:10}}>{it.count}</Text>
            </View>
        })
        );
    }
    render() {
        
        //数据
        const {vocaBooks, curBookName} = this.props.vocaLib
        return (
            <Container style={styles.container}>
                <StatusBar
                    translucent={true}
                    // hidden
                />

                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#FDFDFD'}}></View>
                {/* 头部 */}
                <Header translucent noLeft noShadow style={{backgroundColor:'#FDFDFD', elevation:0,}}>
                    <Button transparent style={{position:'absolute', left:10}}>
                        <AliIcon name='fanhui' size={26} color='#1890FF' onPress={()=>{
                            this.props.navigation.goBack();
                        }}></AliIcon>
                    </Button>
                    <Body style={{flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',}}>
                        <Text style={{fontSize:16, color:'#1890FF', fontWeight:'500'}}>单词书库</Text>
                    </Body>
                </Header> 



                <Content padder style={{ backgroundColor:'#EFEFEF', }}>

                {/* 计划中的单词书 */}
                <View style={styles.planBook}>
                    <View style={[styles.center, { paddingLeft:10}]}>
                        <AliIcon name='yixue' size={26} color='#1890FF'></AliIcon>
                        <View style={[styles.c_center, {alignItems:'flex-start', paddingLeft:20}]}>
                            <Text style={{fontSize:16, color:'#303030', fontWeight:'500' }}>{curBookName}</Text>
                            {/* <Text style={{fontSize:12}}>已掌握23/3090</Text> */}
                        </View>
                    </View>
                    <View style={[styles.c_center,]}>
                        <AliIcon name='xiazai' size={24} color='#A0A0A0'></AliIcon>
                        <Text style={{fontSize:12}}>下载词汇音频包</Text>
                    </View>
                </View>
                {/* 单词书列表 */}
                <Accordion style={{backgroundColor:'#FDFDFD', borderRadius:5, marginTop:20,}}
                    dataArray={vocaBooks}
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
const mapStateToProps = state =>({
    vocaLib : state.vocaLib,
});

const mapDispatchToProps = {
    loadVocaBooks : VocaLibAction.loadVocaBooks,
    changeVocaBook: VocaLibAction.changeVocaBook,
};


export default connect(mapStateToProps,mapDispatchToProps )(VocaLibPage);