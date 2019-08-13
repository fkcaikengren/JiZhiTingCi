import React, { Component } from "react";
import { StatusBar, View, Text, FlatList, TouchableWithoutFeedback} from 'react-native';
import {Header, CheckBox , Button} from 'react-native-elements'
import VocaGroupDao from './service/VocaGroupDao'
import {playSound} from './service/AudioFetch'
import AliIcon from '../../component/AliIcon';
import IndexSectionList from '../../component/IndexSectionList';

import _ from 'lodash'
import styles from './GroupVocaStyle'
import gstyles from '../../style'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const ITEM_HEIGHT = 60;         //item的高度
const HEADER_HEIGHT = 24;       //分组头部的高度
const SEPARATOR_HEIGHT = 1;     //分割线的高度

/*
    总结：禁止在react-navigation里面传递RealmObject对象， 这样对导致Realm对象留在导航里。
    当组件unMount,realm.close()时，仍然存在对RealmObject的引用，而该RealmObject却已经过期了
*/


export default class GroupVocaPage extends Component {
    constructor(props) {
        super(props);
        this.vgDao = VocaGroupDao.getInstance();

        this.state = {
            onEdit:false,
            checked:false,
            flatData:[],
            sideSections:[], 
            sectionIndex:[], 
            stickyHeaderIndices:[]
        }
        console.disableYellowBox=true
    }

    componentDidMount(){
        this._formatData()
    }

    componentWillUnmount(){
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.onEdit == true && nextState.onEdit == false){
          //清理check
          this._cancleCheck()
          return false
        }
        return true
    }
    
    _formatData = () => {          //数据预处理
        // const {getParam} = this.props.navigation
        // const groupName = getParam('groupName')
        const group = this.vgDao.getGroup('Mou');
        let sections = group.sections
        //每组的开头在列表中的位置
        let totalSize = 0;
        //FlatList的数据源
        let flatData = [];
        //分组头的数据源
        let sideSections = [];
        //分组头在列表中的位置
        let sectionIndex = [];
        //arr, 吸顶头部索引
        let stickyHeaderIndices = [];

        //对section排序
        sections = _.sortBy(sections, ['section'])

        //格式化sections
        for (let i = 0; i < sections.length; i++) {        //遍历章节
            
            //给右侧的滚动条进行使用的
            sideSections[i] = sections[i].section,
            sectionIndex[i] = totalSize;
            stickyHeaderIndices.push(totalSize);
            //FlatList的数据
            flatData.push({
                type:'chapter', section:sections[i].section,
            });
            totalSize ++;
            for (let w of sections[i].words) { //遍历单词
                flatData.push({
                    type:'word',
                    word:w.word,
                    checked:false,
                    isHidden:w.isHidden,
                    tran:w.tran,
                    enPhonetic:w.enPhonetic, 
                    enPronUrl:w.enPronUrl
                });
                totalSize ++;
            }                                           
            
        }
        // console.log(sectionIndex1); [0, 8, 16, 24, 32, 37, 45, 53, 61, 69]
        this.setState({flatData, sideSections, sectionIndex, stickyHeaderIndices})
       
    }
    
    // 取消check
    _cancleCheck = ()=>{
        const data = [...this.state.flatData]
        for(let d of data){
            d.checked = false
        }
        this.setState({flatData:data, checked:false})
    }
    
    //多选
    _selectItem = (index)=>{
        const data = [...this.state.flatData]
        let checked = this.state.checked 
        if(data[index].checked){//取消
            data[index].checked = false
            let exist = false
            //遍历判断是否存在被选中的
            for(let d of data){
                if(d.checked){
                exist = true
                break;
                }
            }
            if(!exist){
                checked = false
            }
        }else{                  //选中
            data[index].checked = true
        }
        //如果首次被选
        if(this.state.checked == false){
            checked = true
        }
        this.setState({flatData:data, checked})
    }

    

    //切换编辑状态
    _toggleEdit = ()=>{
        this.setState({onEdit:!this.state.onEdit})
    }

    render() {
        const groupName = 'Mou' //this.props.getParam('groupName')
        const showCheckStyle = this.state.onEdit?{
            backgroundColor:'#FFE957',
            borderColor:'#FFE957',
        }:null
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} />
                <Header
                statusBarProps={{ barStyle: 'light-content' }}
                barStyle="light-content" // or directly
                leftComponent={ 
                    <AliIcon name='fanhui' size={26} color='#303030' onPress={()=>{
                        this.props.navigation.goBack();
                    }}></AliIcon> }
                centerComponent={{ text: groupName, style: { color: '#303030', fontSize:18 } }}
                rightComponent={
                    <TouchableWithoutFeedback onPress={this._toggleEdit}>
                         <Text style={[styles.editBtn,showCheckStyle]}>编辑</Text>
                    </TouchableWithoutFeedback>
                }
                containerStyle={{
                    backgroundColor: '#FCFCFC',
                    justifyContent: 'space-around',
                }}
                />
               
                {this.state.flatData.length > 0 &&
                    <View style={{flex:1}}>
                        <FlatList
                            ref={ref => this._list = ref}
                            data={this.state.flatData}
                            renderItem={this._renderItem}
                            extraData={this.state}
                            getItemLayout={this._getItemLayout}
                            keyExtractor={item => item.type}
                            stickyHeaderIndices={this.state.stickyHeaderIndices}/> 
                        <IndexSectionList
                        sections={ this.state.sideSections}
                        onSectionSelect={this._onSectionselect}/> 
                    </View>
                }
              
            </View>
        );
    }



     //这边返回的是A,0这样的数据
    _onSectionselect = (section, index) => {
        //跳转到某一项
        // console.log('=>'+index);
        this._list.scrollToIndex({animated: false, index: this.state.sectionIndex[index], viewPosition:0});
    }

    //data:flatData, index: item的下标
    _getItemLayout = (data, index)=> {
        let length = ITEM_HEIGHT
        if(this.state.sectionIndex.includes(index)){
            console.log(`include --- ${index}`)
            length = HEADER_HEIGHT
        }

        //  计算几个header,设计偏移量算法
        // sectionIndex [0, 8, 16, 24, 32, 37, 45, 53, 61, 69]
        let headerCount = 0;
        for (let i in this.state.sectionIndex){
            if(this.state.sectionIndex[i] < index){
                headerCount++;
            }else{
                break;
            }
        }
        const offset = (index-headerCount)*(ITEM_HEIGHT+SEPARATOR_HEIGHT) + headerCount*(HEADER_HEIGHT+SEPARATOR_HEIGHT)
        console.log(`offset : ${offset}`); 
        return {index, offset, length};
    }

    _renderItem = ({item,index}) => {
        let flag = (item.type === 'chapter');
        const itemPaddingLeft = this.state.onEdit?0:20
        const bodyWidth = this.state.onEdit?width-60:width-40
        return (
                flag
                ?<View key={'h'+index} style={styles.headerView}>
                        <Text style={styles.headerText}>{item.section}</Text>
                    </View>
                :<View style={[gstyles.r_start, styles.itemView, {paddingLeft:itemPaddingLeft}]}>
                    {this.state.onEdit &&
                        <CheckBox
                        containerStyle={styles.checkBox}
                        onPress={()=>{this._selectItem(index)}}
                        checked={item.checked}
                        iconType='ionicon'
                        checkedIcon='ios-checkmark-circle'
                        uncheckedIcon='ios-radio-button-off'
                        checkedColor='#F29F3F'
                        />
                    }
                    <View key={'w'+index} style={[gstyles.c_center, {width:bodyWidth}]}>
                        <View style={[gstyles.r_between, {width:'100%'}]}>
                            <View style={[gstyles.r_start]}>
                                    <Text style={{fontSize:16, color:'#303030'}}>{item.word}</Text>
                                    <Text style={{fontSize:12, color:'#AAA', fontWeight:'300', marginLeft:10}}>{`英 ${item.enPhonetic}`}</Text>
                            </View>
                            <AliIcon name='shengyin' size={24}  color='#666' onPress={()=>{
                                playSound(item.enPronUrl)
                            }} />
                        </View>
                        <View style={[gstyles.r_start,{width:'100%'}]}>
                            <Text numberOfLines={1} style={{fontSize:14, color:'#666', }}>{item.tran}</Text>
                        </View>
                    </View>
                </View>
                    
        )
        
    }
}


