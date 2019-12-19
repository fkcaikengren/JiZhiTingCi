import React, { Component } from "react";
import { StatusBar, View, Text, FlatList, TouchableWithoutFeedback} from 'react-native';
import {Header, CheckBox , Button } from 'react-native-elements'
import {sortBy} from 'lodash'
import CardView from 'react-native-cardview'
import Toast from 'react-native-easy-toast'
import {connect} from 'react-redux';
import BackgroundTimer from 'react-native-background-timer';

import AliIcon from '../../component/AliIcon';
import IndexSectionList from '../../component/IndexSectionList';
import VocaUtil from './common/vocaUtil'
import * as VocaPlayAction from './redux/action/vocaPlayAction'
import * as Constant from './common/constant'
import * as CConstant from '../../common/constant'

import styles from './GroupVocaStyle'
import gstyles from '../../style'
import AudioService from "../../common/AudioService";
import VocaGroupService from "./service/VocaGroupService";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const ITEM_HEIGHT = 60;         //item的高度
const HEADER_HEIGHT = 24;       //分组头部的高度
const SEPARATOR_HEIGHT = 1;     //分割线的高度

/*
    总结：禁止在react-navigation里面传递RealmObject对象， 这样对导致Realm对象留在导航里。
    当组件unMount,realm.close()时，仍然存在对RealmObject的引用，而该RealmObject却已经过期了
*/


class GroupVocaPage extends Component {
    constructor(props) {
        super(props);
        this.vgService = new VocaGroupService()
        this.audioService = AudioService.getInstance()

        this.state = {
            onEdit:false,
            checked:false,
            checkedIndex:[], //选中的索引
            flatData:[],
            sideSections:[], 
            sectionIndex:[], 
            stickyHeaderIndices:[]
        }
        // console.log(this.props.navigation.state.params.refreshGroup)
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
        const {getParam} = this.props.navigation
        const groupName = getParam('groupName')
        const group = this.vgService.getGroup(groupName);
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
        sections = sortBy(sections, ['section'])

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
                    trans:w.trans,
                    amPhonetic:w.amPhonetic, 
                    amPronUrl:w.amPronUrl,
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
        const groupName = this.props.navigation.getParam('groupName')
        const words = this.state.checkedIndex.map((itemIndex, i)=>{
            return this.state.flatData[itemIndex].word
        })
        const result = this.vgService.deleteWords(groupName, words)
        if(result.success){
            this.toastRef.show(`成功删除${result.deletedWords.length}个生词`, 1000);
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

            //刷新生词本页面数据
            this.props.navigation.state.params.refreshGroup();
        }else{
            this.toastRef.show('删除失败', 1000);
            //不刷新
        }
    }


    _playBtn = ()=>{
        const words = this.state.checkedIndex.map((itemIndex, i)=>{
            return this.state.flatData[itemIndex].word
        })
        console.log(words)
        if(words.length < Constant.MIN_PLAY_NUMBER){
            this.toastRef.show('当前选择不足5个，不可以播放哦')
        }else{
            const virtualTask = VocaUtil.genVirtualTask(words)
            // console.log(virtualTask)

            //暂停
            const {autoPlayTimer, } = this.props.vocaPlay
            if(autoPlayTimer){
                BackgroundTimer.clearTimeout(autoPlayTimer);
                this.props.changePlayTimer(0);
            }

            this.props.navigation.navigate('VocaPlay',{
                task:virtualTask, 
                mode:Constant.NORMAL_PLAY,
                normalType: Constant.BY_VIRTUAL_TASK,
            });
        }
    }

    _keyExtractor = (item, index) => {
        if(item.type === 'section'){
            return item.section+index
        }else{
            return item.word+index
        }
    }

    render() {
        const groupName = this.props.navigation.getParam('groupName')
        const delIconColor = this.state.checked?'#F2753F':'#999'
        const playIconColor= this.state.checked?gstyles.mainColor:'#999'
        const editBtn = this.state.onEdit?<Text style={gstyles.md_black}>取消</Text>
            :<AliIcon name='bianji' size={24} color={gstyles.black}></AliIcon>
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} />
                <Header
                statusBarProps={{ barStyle: 'dark-content' }}
                barStyle='dark-content' // or directly
                leftComponent={ 
                    <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={()=>{
                        this.props.navigation.goBack()
                    }}/> }
                centerComponent={{ text: groupName, style:gstyles.lg_black_bold }}
                rightComponent={
                    <TouchableWithoutFeedback onPress={this._toggleEdit}>
                    {
                        editBtn
                    }
                    </TouchableWithoutFeedback>
                }
                containerStyle={{
                    backgroundColor: gstyles.mainColor,
                    justifyContent: 'space-around',
                }}
                />
                <Toast
                    ref={ref=>this.toastRef = ref}
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
                            keyExtractor={this._keyExtractor}
                            stickyHeaderIndices={this.state.sectionIndex}/>
                        <IndexSectionList
                        sections={ this.state.sideSections}
                        onSectionSelect={this._onSectionselect}/> 
                    </View>
                }
                {this.state.flatData.length <= 0 &&
                    <View style={[gstyles.c_center,{flex:1}]}>
                        <AliIcon name={'nodata_icon'} size={100} color={gstyles.black} />
                        <Text style={gstyles.md_black}>还没来得及添加生词哦</Text>
                    </View>
                }

                <CardView
                    cardElevation={5}
                    cardMaxElevation={5}
                    cornerRadius={20}
                    style={gstyles.footer}>
                        <View style={gstyles.r_around}>
                            <Button 
                                disabled={!this.state.checked}
                                type="clear"
                                icon={ <AliIcon name='shanchu' size={26} color={delIconColor} />}
                                title='删除'
                                titleStyle={[gstyles.md_black_bold,{ paddingBottom:2,lineHeight:20}]}
                                onPress={this._deleteWords}>
                            </Button>
                            <View style={{width:1,height:20,backgroundColor:'#999'}}></View>
                            <Button 
                                disabled={!this.state.checked}
                                type="clear"
                                icon={ <AliIcon name='Home_tv_x' size={26} color={playIconColor} />}
                                title='播放'
                                titleStyle={[gstyles.md_black_bold,{ paddingBottom:2, lineHeight:20}]}
                                onPress={this._playBtn}>
                            </Button>
                        </View>
                </CardView>
              
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

        const translation = VocaUtil.transToText(item.trans)
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
                                    <Text style={{fontSize:12, color:'#AAA', fontWeight:'300', marginLeft:10}}>{`美 ${item.amPhonetic}`}</Text>
                            </View>
                            <AliIcon name='shengyin' size={24}  color='#666' onPress={()=>{
                                this.audioService.playSound({
                                    pDir : CConstant.VOCABULARY_DIR,
                                    fPath : item.amPronUrl
                                })
                            }} />
                        </View>
                        <View style={[gstyles.r_start,{width:'100%'}]}>
                            <Text numberOfLines={1} style={{fontSize:14, color:'#666',}}>{translation}</Text>
                        </View>
                    </View>
                </View>
                    
        )
        
    }
}



const mapStateToProps = state =>({
    vocaPlay : state.vocaPlay,
});

const mapDispatchToProps = {
    changePlayTimer : VocaPlayAction.changePlayTimer,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupVocaPage);