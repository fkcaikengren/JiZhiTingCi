import React, { Component } from "react";
import { StatusBar, View, Text, FlatList, TouchableWithoutFeedback} from 'react-native';
import {Header, CheckBox , Button, Icon, } from 'react-native-elements'
import _ from 'lodash'
import CardView from 'react-native-cardview'
import Toast, {DURATION} from 'react-native-easy-toast'

import VocaGroupDao from './service/VocaGroupDao'
import {playSound} from './service/AudioFetch'
import AliIcon from '../../component/AliIcon';
import IndexSectionList from '../../component/IndexSectionList';

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
            checkedIndex:[], //选中的索引
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
          //清理checked
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

        //对section排序
        sections = _.sortBy(sections, ['section'])

        //格式化sections
        for (let i = 0; i < sections.length; i++) {        //遍历章节
            
            //给右侧的滚动条进行使用的
            sideSections[i] = sections[i].section,
            sectionIndex[i] = totalSize;
            //FlatList的数据
            flatData.push({
                type:'section', section:sections[i].section,
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
        this.setState({flatData, sideSections, sectionIndex})
       
    }
    
    // 取消check
    _cancleCheck = ()=>{
        this.setState({checkedIndex:[], checked:false})
    }
    
    //多选
    _selectItem = (index)=>{
        let checked = this.state.checked 
        let checkedIndex = this.state.checkedIndex
        if(checkedIndex.includes(index)){ //取消
            checkedIndex = checkedIndex.filter((item,i)=>{
                return item !== index
            })
        }else{                            //选中
            checkedIndex.push(index)
        }
       
        if(checkedIndex.length <= 0){
            checked = false
        }
        //如果首次被选
        if(this.state.checked == false){
            checked = true
        }
        this.setState({checkedIndex, checked})
    }


    //切换编辑状态
    _toggleEdit = ()=>{
        this.setState({onEdit:!this.state.onEdit})
    }

    //批量删除单词
    _deleteWords = ()=>{
        //删除
        // const groupName = this.props.navigation.getParam('groupName')
        const groupName = 'Mou'
        const words = this.state.checkedIndex.map((itemIndex, i)=>{
            return this.state.flatData[itemIndex].word
        })
        const result = this.vgDao.deleteWords(groupName, words)
        if(result.success){
            this.refs.toast.show(`成功删除${result.deletedWords.length}个生词`, 1000);
            //刷新
            const flatData = this.state.flatData.filter((item, index)=>{
                let deleted = false
                if(item.type === 'section'){
                    deleted = result.deletedSections.includes(item.section)
                }
                return !deleted && !this.state.checkedIndex.includes(index)
            })
            const sectionIndex = []  //重新计算头部索引
            for(let i in flatData){
                if(flatData[i].type === 'section'){
                    sectionIndex.push(parseInt(i))
                }
            }
            const sideSections = this.state.sideSections.filter((item, index)=>{
                return !result.deletedSections.includes(item)
            })
            this.setState({flatData, sectionIndex, sideSections, onEdit:false})
        }else{
            this.refs.toast.show('删除失败', 1000);
            //不刷新
        }
        
    }

    render() {
        const groupName = 'Mou' //this.props.getParam('groupName')
        const showCheckStyle = this.state.onEdit?{
            backgroundColor:'#FFE957',
            borderColor:'#FFE957',
        }:null
        const delIconColor = this.state.checked?'#F2753F':'#999'
        const playIconColor= this.state.checked?'#FFE957':'#999'
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
                <Toast
                    ref="toast"
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
                {this.state.flatData.length > 0 &&
                    <View style={{flex:1}}>
                        <FlatList
                            ref={ref => this._list = ref}
                            data={this.state.flatData}
                            renderItem={this._renderItem}
                            extraData={this.state}
                            getItemLayout={this._getItemLayout}
                            keyExtractor={(item,index) => index.toString()}
                            stickyHeaderIndices={this.state.sectionIndex}/> 
                        <IndexSectionList
                        sections={ this.state.sideSections}
                        onSectionSelect={this._onSectionselect}/> 
                    </View>
                }

                {//this.state.onEdit &&
                    <CardView
                        cardElevation={5}
                        cardMaxElevation={5}
                        cornerRadius={20}
                        style={styles.footer}>
                            <View style={gstyles.r_around}>
                                <Button 
                                    disabled={!this.state.checked}
                                    type="clear"
                                    icon={ <AliIcon name='shanchu' size={26} color={delIconColor} />}
                                    title='删除'
                                    titleStyle={{fontSize:14,color:'#303030', fontWeight:'500'}}
                                    onPress={this._deleteWords}>
                                </Button>
                                <View style={{width:1,height:20,backgroundColor:'#999'}}></View>
                                <Button 
                                    disabled={!this.state.checked}
                                    type="clear"
                                    icon={ <AliIcon name='Home_tv_x' size={26} color={playIconColor} />}
                                    title='播放'
                                    titleStyle={{fontSize:14,color:'#303030', fontWeight:'500'}}
                                    onPress={this._toggleEdit}>
                                </Button>
                            </View>
                    </CardView>
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
        let flag = (item.type === 'section');
        const itemPaddingLeft = this.state.onEdit?0:20
        const bodyWidth = this.state.onEdit?width-60:width-40
        const itemChecked = this.state.checkedIndex.includes(index)
        console.log(itemChecked)
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
                        checked={itemChecked}
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


