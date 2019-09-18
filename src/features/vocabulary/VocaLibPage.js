import React, { Component } from "react";
import {StatusBar, View, Text, Image, FlatList} from 'react-native';
import { WhiteSpace, Carousel, Grid, Flex, } from '@ant-design/react-native';
import {Header, Button} from 'react-native-elements'
import Picker from 'react-native-picker';
import {connect} from 'react-redux';
import CardView from 'react-native-cardview'
import * as VocaLibAction from './redux/action/vocaLibAction'

import AliIcon from '../../component/AliIcon';
import styles from './VocaLibStyle'


class VocaLibPage extends Component {

    constructor(props){
        super(props)
    }

    componentDidMount(){
         //加载书籍
        this.props.loadVocaBooks()
    }

    shouldComponentUpdate(nextProps, nextState){
        if(this.props.home.isLoadPending === true && nextProps.home.isLoadPending === false){
            this.props.navigation.goBack()
            return false
        }else{
            return true
        }
    }

    /**显示选择器 */
    _show = (el, index)=>{
        let data = [
            ['新学10/复习50',      
            '新学14/复习70',         
            '新学20/复习100',   
            '新学26/复习130',  
            '新学36/复习180', ] 
        ];
        let selectedValue = [15];
        Picker.init({ 
            pickerTextEllipsisLen:10,
            pickerData: data,
            selectedValue: selectedValue,
            pickerCancelBtnText: '取消',
            pickerTitleText: el.name,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnColor: [30,30,30,1],
            pickerTitleColor: [30,30,30,1],
            pickerConfirmBtnColor: [30,30,30,1],
            pickerToolBarBg: [255,233,87, 1],
            onPickerConfirm: data => {
                console.log(data)
                const sum = parseInt(data[0].replace(/新学(\d+).+/,'$1'))
                console.log(sum)
                let taskCount = null
                let taskWordCount = null
                if(sum <= 19){
                    taskCount = 2 //1
                    taskWordCount = sum/2
                }else if(sum <= 34){
                    taskCount = 4 //2
                    taskWordCount = sum/4
                }else if(sum <= 54){
                    taskCount = 6 //3
                    taskWordCount = sum/6
                }
                console.log('制定计划，单词书编号为：'+el.id)
                console.log(taskCount, taskWordCount);
                //提交计划
                if(taskCount!==null && taskWordCount!==null){
                    this.props.changeVocaBook(`VB_${el.id}`, taskCount,taskWordCount)
                }else{
                    console.error('VocaLibPage: 设置计划时，数据错误！')
                }
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
            }
        });
        Picker.show();
    }

    _renderBooks = ({item, index})=>{
        return <View style={[styles.c_center, styles.bookView]}
        onStartShouldSetResponder={(e)=>true}
        onResponderGrant={(e)=>this._show(item,index)}
        >
            <CardView
                cardElevation={5}
                cardMaxElevation={5}
                style={styles.imgCard}
                >
                    <Image source={{uri:item.coverUrl}} style={styles.img}  />
            </CardView>
            <Text style={styles.bookname}>{item.name}</Text>
            <Text style={styles.noteText}>共<Text style={[styles.noteText,{color:'#F29F3F'}]}>{item.count}</Text>个单词</Text>
        </View>
    }
    
    render() {
        const {books, plan, isLoadPending} = this.props.vocaLib
        //数据
        return (
            
            <View style={{flex: 1}}>
                <StatusBar translucent={false}  barStyle="dark-content" />
                <Header
                statusBarProps={{ barStyle: 'dark-content' }}
                barStyle="dark-content" // or directly
                leftComponent={ 
                    <AliIcon name='fanhui' size={26} color='#303030' onPress={()=>{
                        this.props.navigation.goBack();
                    }}></AliIcon> }
                rightComponent={
                    <AliIcon name='xiazai' size={24} color='#303030'></AliIcon>
                }
                centerComponent={{ text: plan.bookName, style: { color: '#303030', fontSize:18 } }}
                containerStyle={{
                    backgroundColor: '#FCFCFC',
                    justifyContent: 'space-around',
                }}
                />
                <WhiteSpace size="lg" />
                {isLoadPending &&
                    <View style={{
                        flex:1,
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center',}}>
                        <Text>加载</Text>
                    </View>
                }
                
                {!isLoadPending &&
                    <FlatList
                        data={books}
                        renderItem={this._renderBooks}
                        ItemSeparatorComponent={()=><View style={{borderBottomWidth:1,borderBottomColor:'#A8A8A8'}}></View>}
                        // 水平布局的列的数量
                        numColumns = {2}  
                        
                    />
                }
            </View>
            
            
        );
    }
}
const mapStateToProps = state =>({
    vocaLib: state.vocaLib,
    home: state.home
});

const mapDispatchToProps = {
    loadVocaBooks: VocaLibAction.loadVocaBooks,
    changeVocaBook: VocaLibAction.changeVocaBook
}


export default connect(mapStateToProps,mapDispatchToProps )(VocaLibPage);