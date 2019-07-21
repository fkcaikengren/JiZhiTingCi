import React, { Component } from "react";
import {StatusBar, View, Text, Image, ScrollView} from 'react-native';
import { WhiteSpace, Carousel, Grid, Flex, } from '@ant-design/react-native';
import {Header, Button} from 'react-native-elements'
import Picker from 'react-native-picker';
import {connect} from 'react-redux';
import CardView from 'react-native-cardview'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import * as VocaLibAction from './redux/action/vocaLibAction'

import AliIcon from '../../component/AliIcon';
import styles from './VocaLibStyle'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

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
         //加载书籍
        this.props.loadVocaBooks()

    }

    /**显示选择器 */
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
            // pickerBg: [255,233,87, 0.8],
            onPickerConfirm: data => {
                //提交计划
                console.log(el.bookCode, data)
                this.props.changeVocaBook(el.bookCode, data);
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
        return  <View style={styles.c_center}>
            <CardView
                cardElevation={10}
                cardMaxElevation={10}
                cornerRadius={2}
                style={styles.bookCard}>
                    <Image source={{uri:el.coverUrl}} style={styles.img} />
            </CardView>
            <Text style={styles.bookname}>{el.name}</Text>
            <Text style={styles.noteText}>共<Text style={[styles.noteText,{color:'#F29F3F'}]}>{el.count}</Text>个单词</Text>
        </View>
    }
    
    render() {
        const {books, isLoadPending} = this.props
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
                {isLoadPending &&
                    <View style={{
                        flex:1,
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center',}}>
                        <Bubbles size={10} color="#FFE957" />
                    </View>
                }
                
                {!isLoadPending &&
                    <ScrollView style={{ flex: 1 }}
                        pagingEnabled={false}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <Grid
                            data={books}
                            columnNum={2}
                            renderItem={this._renderBooks}
                            itemStyle={styles.grid}
                            onPress={this._show}
                        />
                    </ScrollView>
                }
            </View>
            
            
        );
    }
}
const mapStateToProps = state =>({
    books: state.vocaLib.books,
    isLoadPending: state.vocaLib.isLoadPending,
});

const mapDispatchToProps = dispatch=> ({
    loadVocaBooks: ()=>{dispatch(VocaLibAction.loadVocaBooks())},
    changeVocaBook: (bookCode, taskCount)=>{dispatch(VocaLibAction.changeVocaBook())}
});


export default connect(mapStateToProps,mapDispatchToProps )(VocaLibPage);