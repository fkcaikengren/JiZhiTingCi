import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text, FlatList} from 'react-native';
import { Container, Header, Content, Icon, Accordion,Body,Title,
    Grid, Col, Button} from "native-base";
import {connect} from 'react-redux'
import AliIcon from '../../component/AliIcon';
import IndexSectionList from '../../component/IndexSectionList';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const ITEM_HEIGHT = 80; //item的高度
const HEADER_HEIGHT = 24;  //分组头部的高度
const SEPARATOR_HEIGHT = 1;  //分割线的高度

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
    headerView: {
        justifyContent:'center',
        height: HEADER_HEIGHT,
        paddingLeft: 20,
        backgroundColor: '#EFEFEF'
    },
    headerText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#303030'
    },
    itemView: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        height: ITEM_HEIGHT,
        backgroundColor:'#FFF',
        borderBottomWidth:1,
        borderColor:'#EFEFEF'
    },
    rowBetween: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:width-40,
    }, 
    rowStart:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    }
});


class GroupVocaPage extends Component {
    constructor(props) {
        super(props);
        this.flatData = []
        this.sections = []
        this.sectionIndex = []
        this.stickyHeaderIndices  = []
    }

    componentDidMount(){
        //不要把数据处理放在这里
        //分析: 由于navigation没有让redux管理，在redux处理异步数据时，navigation已经调到目标页面，但数据还未加载
        //      componentDidMount只(在装载时)加载一次，不跟随redux的状态树变化而调动。
        //      所以，应该将数据处理放在componentDidUpdate 或render里。
    }

    componentDidUpdate(){

    }

    _formatData = () => {          //数据预处理
        const {groupVocas } = this.props.groupVoca
        console.log(groupVocas);
        //每组的开头在列表中的位置
        let totalSize = 0;
        //FlatList的数据源
        let flatData = [];
        //分组头的数据源
        let sections1 = [];
        //分组头在列表中的位置
        let sectionIndex1 = [];
        //arr, 吸顶头部索引
        let stickyHeaderIndices1 = [];
        for (let i = 0; i < groupVocas.length; i++) {        //遍历章节
            
            //给右侧的滚动条进行使用的
            sections1[i] = groupVocas[i].sectionId,
            sectionIndex1[i] = totalSize;
            stickyHeaderIndices1.push(totalSize);
            //FlatList的数据
            flatData.push({
                type:'chapter', sectionId:groupVocas[i].sectionId,
            });
            totalSize ++;
            for (let w of groupVocas[i].words) { //遍历单词
                flatData.push({
                    type:'word',  word:w.word, isHidden:w.isHidden, tran:w.tran
                });
                totalSize ++;
            }                                           
            
        }
        // console.log(sectionIndex1); [0, 8, 16, 24, 32, 37, 45, 53, 61, 69]
        
        this.flatData = flatData, 
        this.sections = sections1
        this.sectionIndex = sectionIndex1
        this.stickyHeaderIndices = stickyHeaderIndices1
        console.log(this.sections);
    }

    render() {
        this._formatData()
        return (
            <Container style={styles.container}>
                <StatusBar
                    translucent={true}
                    // hidden
                />

                <View style={{width:width, height:STATUSBAR_HEIGHT, backgroundColor:'#FDFDFD'}}></View>
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
                        <Text style={{fontSize:16, color:'#1890FF', fontWeight:'500'}}>我的生词</Text>
                    </Body>
                </Header> 
                {(this.flatData.length > 0) &&
                        <View >
                            <FlatList
                                ref={ref => this._list = ref}
                                data={this.flatData}
                                renderItem={this._renderItem}
                                getItemLayout={this._getItemLayout}
                                keyExtractor={item => item.type}
                                stickyHeaderIndices={this.stickyHeaderIndices}/>
                                
                                <IndexSectionList
                                sections={ this.sections}
                                onSectionSelect={this._onSectionselect}/> 
                        </View>
                    }
              
            </Container>
        );
    }



     //这边返回的是A,0这样的数据
     _onSectionselect = (section, index) => {
        //跳转到某一项
        console.log('=>'+index);
        this._list.scrollToIndex({animated: false, index: this.sectionIndex[index], viewPosition:0});
    }

    
    _getItemLayout = (data, index)=> {
        let [length, separator, header] = [ITEM_HEIGHT, SEPARATOR_HEIGHT, HEADER_HEIGHT];
        //  计算几个header,设计偏移量算法
        // sectionIndex [0, 8, 16, 24, 32, 37, 45, 53, 61, 69]
        let headCount = 0;
        for (let i in this.sectionIndex){
            if(this.sectionIndex[i] >= index){
                headCount = i;
                break;
            }
        }
        // console.log(`index:${index}-headCount: ${headCount}`); //所有项的索引，section个数
        return {index, offset:(length+separator)*(index-headCount) + header*(headCount) , length};
    }

    _renderItem = ({item,index}) => {
        let flag = (item.type === 'chapter');
        return (
                flag
                ?<View key={'h'+index} style={styles.headerView}>
                        <Text style={styles.headerText}>{item.sectionId}</Text>
                    </View>
                :<View key={'w'+index} style={styles.itemView}>
                    <View style={styles.rowBetween}>
                        <View style={styles.rowStart}>
                            <Text style={{fontSize:16, color:'#1890FF'}}>1</Text>
                            <Text style={{fontSize:16, color:'#303030', marginLeft:10}}>{item.word}</Text>
                        </View>
                        <AliIcon name='shengyin' size={26} color='#1890FF'></AliIcon>
                    </View>
                    <View style={[styles.rowStart,{width:width-40}]}>
                        <Text style={{fontSize:14, color:'#606060', }}>{item.tran}</Text>
                    </View>
                </View>
        )
        
    }
}

const mapStateToProps = state =>({
    groupVoca : state.groupVoca,
});


const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupVocaPage);