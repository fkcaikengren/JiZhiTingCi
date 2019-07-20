import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text, Image, ScrollView} from 'react-native';
import {
    WhiteSpace, Carousel, Grid, Flex, 
} from '@ant-design/react-native';
import {Header, Button} from 'react-native-elements'
import Picker from 'react-native-picker';
import {connect} from 'react-redux';
import CardView from 'react-native-cardview'

import AliIcon from '../../component/AliIcon';


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#FDFDFD',
        flex: 1
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
    },
    grid: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    bookCard: {
        width:75,
        height:100,
        marginBottom:10,
    },
    img: {
        width:90,
        height:120,
    },
    bookname: {
        fontSize: 16,
        color:'#303030',
        fontWeight:'500',
    },
    noteText:{
        fontSize: 12,
    }
});


class VocaLibPage extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: [{imgPath:'/pic/1.jpg', name:'初中词汇书'},{imgPath:'/pic/2.jpg', name:'高中词汇书'},
            {imgPath:'/pic/3.jpg', name:'考研词汇书'},{imgPath:'/pic/1.jpg', name:'四级词汇书'},{imgPath:'/pic/2.jpg', name:'六级词汇书'},
            {imgPath:'/pic/3.jpg', name:'雅思词汇书'},{imgPath:'/pic/3.jpg', name:'托福词汇书'}]
        }
    }

    componentDidMount(){
        //加载数据
        // const {loadVocaBooks} = this.props
        // loadVocaBooks()

    }

    _show = (el, index)=>{
        // const {changeVocaBook} = this.props
        let data = [
            [15,30,45,60],    //新学列表数
        ];
        let selectedValue = [15];
        Picker.init({
            pickerData: data,
            selectedValue: selectedValue,
            pickerCancelBtnText: '取消',
            pickerTitleText: el.name,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnColor: [30,30,30,1],
            pickerTitleColor: [30,30,30,1],
            pickerConfirmBtnColor: [30,30,30,1],
            pickerToolBarBg: [255,233,87, 1],
            pickerBg: [255,233,87, 0.8],
            onPickerConfirm: data => {
                // changeVocaBook(el.name, listCount,  listWordCount);
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

    _renderBooks = (el,index)=>{
        const baseUrl = 'https://test1-1259360612.cos.ap-chengdu.myqcloud.com'
        return  <View style={styles.c_center}>
            <CardView
                cardElevation={10}
                cardMaxElevation={10}
                cornerRadius={2}
                style={styles.bookCard}>
                    <Image source={{uri:baseUrl+el.imgPath}} style={styles.img} />
            </CardView>
            <Text style={styles.bookname}>{el.name}</Text>
            <Text style={styles.noteText}>共<Text style={[styles.noteText,{color:'#F29F3F'}]}>3012</Text>个单词</Text>
        </View>
    }
    
    render() {
        
        //数据
        return (
            <View style={{flex: 1}}>
                <StatusBar translucent={true} />
                <Header
                statusBarProps={{ barStyle: 'light-content' }}
                barStyle="light-content" // or directly
                leftComponent={ 
                    <AliIcon name='fanhui' size={26} color='#303030' onPress={()=>{
                        this.props.navigation.goBack();
                    }}></AliIcon> }
                rightComponent={
                    <AliIcon name='xiazai' size={24} color='#303030'></AliIcon>
                }
                centerComponent={{ text: '四级词汇', style: { color: '#303030', fontSize:18 } }}
                containerStyle={{
                    backgroundColor: '#FCFCFC',
                    justifyContent: 'space-around',
                }}
                />
              
                    <WhiteSpace size="lg" />
                    <ScrollView style={{ flex: 1 }}
                        pagingEnabled={false}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <Grid
                            data={this.state.data}
                            columnNum={2}
                            renderItem={this._renderBooks}
                            itemStyle={styles.grid}
                            onPress={this._show}
                        />
                    </ScrollView>

                    
            </View>
        );
    }
}
const mapStateToProps = state =>({
});

const mapDispatchToProps = {
};


export default connect(mapStateToProps,mapDispatchToProps )(VocaLibPage);