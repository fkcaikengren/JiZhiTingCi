

'use strict';
import React, { Component } from "react";
import {View, Text, TouchableOpacity, FlatList, StyleSheet,} from 'react-native';
import {Header} from 'react-native-elements'
import AliIcon from '../../component/AliIcon';
import styles from './ArticleManageStyle'
import gstyles from '../../style'
import VocaTaskDao from "./service/VocaTaskDao";
import ArticleDao from "../reading/service/ArticleDao";
import VocaUtil from './common/vocaUtil'


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default class ArticleManagePage extends Component {

    constructor(props){
        super(props);
        this.state = {
            articles: []
        };
        this.taskDao = VocaTaskDao.getInstance()
        this.articleDao = ArticleDao.getInstance()
        console.disableYellowBox=true;
    }

    componentDidMount(){
        //查询已学习过的任务
        const learnedTasks = this.taskDao.getLearnedTasks()
        const articles = VocaUtil.copyArticlesKW(this.articleDao.getArticles(VocaUtil.getArticleIds(learnedTasks)))
        this.setState({articles})
    }

    _renderRight = () =>{
        return <View style={gstyles.r_start_bottom}>
            <Text style={[gstyles.xs_gray,{paddingBottom: 5,paddingRight:5}]}>正确率:</Text>
            <Text style={[{fontSize:30,color:gstyles.emColor,marginRight:10,}]}>80%</Text>
        </View>
    }

   _renderItem = ({item, index})=>{

       let serial = 0
       if(index < 10){
           serial = '00'+index
       }else if(index < 100){
           serial = '0'+index
       }else{
           serial = ''+index
       }
       return (
           <TouchableOpacity
               activeOpacity={0.8}
               onPress={()=>{
                   this.props.navigation.navigate('ArticleTab',{articleInfo:item })
               }}>
               <View style={[{flex:1,}, gstyles.r_start]}>
                   <View style={[{flex:1},gstyles.c_center]}>
                       <Text style={gstyles.serialText}>{serial}</Text>
                   </View>
                   <View style={[{flex:6, padding:10, borderColor: '#EFEFEF',
                       borderBottomWidth: StyleSheet.hairlineWidth,}, gstyles.r_between_bottom]}>
                       <View stye={styles.nameView}>
                           <Text style={[gstyles.md_black,{fontWeight:'500'}]}>{item.name}</Text>
                           <View style={styles.noteView}>
                               <Text style={styles.noteText}>{item.note}</Text>
                           </View>
                       </View>
                       {
                           this._renderRight()
                       }
                   </View>
               </View>

           </TouchableOpacity>
       );
   }



    render() {
        return (
            <View style={styles.container}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content'
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={()=>{
                            this.props.navigation.goBack();
                        }} /> }
                    centerComponent={{ text: '阅读真题', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                <FlatList
                    data={this.state.articles}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state.articles}
                />

            </View>
        );
    }
}
