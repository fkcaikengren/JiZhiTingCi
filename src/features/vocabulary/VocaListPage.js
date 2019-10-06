import React, {Component, PureComponent} from "react";
import {FlatList, View, Text, ActivityIndicator, StatusBar,} from "react-native";
import { CheckBox , Button} from 'react-native-elements'
import BackgroundTimer from 'react-native-background-timer';
import PropTypes from 'prop-types'
import CardView from 'react-native-cardview'

import TogglePane from './component/TogglePane'
import * as Constant from './common/constant'
import AliIcon from '../../component/AliIcon';
import gstyles from '../../style'
import styles from './VocaListStyle'
import VocaTaskService from './service/VocaTaskService'
import VocaUtil from "./common/vocaUtil";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const ITEM_HEIGHT = styles.item.height;         //item的高度
const HEADER_HEIGHT = styles.headerView.height;       //分组头部的高度
const SEPARATOR_HEIGHT = 0;     //分割线的高度

export default class VocaListPage extends Component {
  constructor() {
    super();
    this.state = {
      data:[],
      stickyHeaderIndices: [],
      checked:false, //是否有被选的
    };
    this.vtService = new VocaTaskService()
  }

  componentWillMount() {
    //获取数据
    let data = []
    switch(this.props.type){
      case Constant.WRONG_LIST:
          data= this.vtService.getWrongList()
      break;
      case Constant.PASS_LIST:
          data= this.vtService.getPassList()
      break;
      case Constant.LEARNED_LIST:
          data= this.vtService.getLearnedList()
      break;
      case Constant.NEW_LIST:
          data= this.vtService.getNewList()
      break;
    }
    
    const headers = [];
    data.map(item => {
      if (item.isHeader) {
        headers.push(data.indexOf(item));
      }
      return item
    });
    headers.push(0);
    this.setState({
      data: data,
      stickyHeaderIndices: headers
    });
  }


  shouldComponentUpdate(nextProps, nextState) {
    const {data, checked} = this.state
    const {onEdit} = this.props.vocaList
        if(onEdit == true && nextProps.vocaList.onEdit == false){
      //清理check
      this._cancleCheck()
      return false
    }

    if(this.props.index !== this.props.pageIndex){
      return false
    }

    //刷新的因素：data,checked,onEdit
    if(data === nextState.data &&  checked === nextState.checked && onEdit === nextProps.vocaList.onEdit){
      return false
    }else{
      return true
    }

  }

  // 取消check
  _cancleCheck = ()=>{
    let start = new Date().getTime()
    const data = [...this.state.data]
    for(let d of data){
      d.checked = false
    }
    this.setState({data, checked:false})
    let end = new Date().getTime()
    console.log('cancle: '+ (end-start))
  }

  //多选
  _selectItem = (index)=>{
    console.log('change state --'+index)
    console.log(index)


    const data = [...this.state.data]
    let checked = this.state.checked
    if(data[index].checked){//取消
      data[index] = {...data[index], checked : false}
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
      data[index] = {...data[index], checked : true}
    }
    //如果首次被选
    if(this.state.checked == false){
      checked = true
    }
    this.setState({data, checked})


  }

  renderItem = ({ item, index }) => {
    return <Cell item={item} index={index} onEdit={this.props.vocaList.onEdit}
                 selectItem={this._selectItem}/>
  };
  

  _playBtn = ()=>{
    if(this.props === Constant.PASS_LIST){

    }else{
      const data = this.state.data.filter((item,index)=>{
        if(item.checked === true){
          return true
        }else{
          return false
        }
      })
      const words = data.map((item, index)=>item.content)
      if(words.length < Constant.MIN_PLAY_NUMBER){
        this.props.toastRef.show('当前选择不足5个，不可以播放哦')
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
  }


  //data:item数组, index: item的下标
  _getItemLayout = (data, index)=> {
    let length = ITEM_HEIGHT
    const {stickyHeaderIndices} = this.state
    if(stickyHeaderIndices.includes(index)){
      length = HEADER_HEIGHT
    }
    //  计算几个header,设计偏移量算法
    let headerCount = 0;
    for (let i in stickyHeaderIndices){
      if(stickyHeaderIndices[i] < index){
        headerCount++;
      }else{
        break;
      }
    }
    const offset = (index-headerCount)*(ITEM_HEIGHT+SEPARATOR_HEIGHT) + headerCount*(HEADER_HEIGHT+SEPARATOR_HEIGHT)
    return {index, offset, length};
  }

  _keyExtractor = (item, index) => {
    if(item.content){
      return item.content.word+index
    }else{
      return item.title+index.toString()
    }
  }

  render() {
    //性能测试
    console.log('-------------------> VocaListPage : '+ this.props.type)

    let title = ''
    let iconName = 'Home_tv_x'
    let noData = '暂无数据'
    switch(this.props.type){
      case Constant.WRONG_LIST:
          title='播放'
          noData = '你还没有错词哦'
      break;
      case Constant.PASS_LIST:
          title='还原'
          iconName = 'huanyuan'
          noData = '你还没有pass过单词哦'
      break;
      case Constant.LEARNED_LIST:
          title='播放'
          noData = '你还没有学过的单词哦'
      break;
      case Constant.NEW_LIST:
          title='播放'
          noData = '没有新学的单词哦'
      break;
    }

    const playIconColor= this.state.checked?gstyles.mainColor:'#999'
    return (
      <View style={styles.container}>

        {this.state.data.length > 0 &&
          <FlatList
              data={this.state.data}
              renderItem={this.renderItem}
              keyExtractor={this._keyExtractor}
              stickyHeaderIndices={this.state.stickyHeaderIndices}
              getItemLayout={this._getItemLayout}
              extraData={this.props.vocaList.onEdit}
          />
        }
        {this.state.data.length <= 0 &&
          <View style={[gstyles.c_center,{flex:1}]}>
            <AliIcon name={'nodata_icon'} size={100} color={gstyles.black} />
            <Text style={gstyles.md_black}>{noData}</Text>
          </View>
        }
        {/* 按钮 */}
        {this.props.vocaList.onEdit &&
        <CardView
            cardElevation={5}
            cardMaxElevation={5}
            cornerRadius={20}
            style={gstyles.footer}>
            <Button
                disabled={!this.state.checked}
                type="clear"
                icon={ <AliIcon name={iconName} size={26} color={playIconColor} style={{marginRight:10}}/>}
                title={title}
                titleStyle={[gstyles.md_black ,{ fontWeight:'500',lineHeight:24}]}
                onPress={this._playBtn}
                containerStyle={{width:'100%'}}
            >
            </Button>
          </CardView>
        }
      </View>
    );
  }
}

VocaListPage.propTypes = {
  type : PropTypes.string.isRequired,
  index : PropTypes.number.isRequired,
  pageIndex : PropTypes.number.isRequired,
  toastRef : PropTypes.object
};




class Cell extends Component{

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {item, onEdit, index,} = this.props

    // console.log('----------cell---'+index)
    // console.log(item === nextProps.item)
    if(item === nextProps.item && onEdit === nextProps.onEdit ){
      // console.log('false ----'+index)
      return false
    }else {
      // console.log('true ----'+index)
      return true
    }
  }

  _select = ()=>{
    this.props.selectItem(this.props.index)
  }

  render(){
    // console.log('-cell------rerender-')
    const {item, onEdit, index} = this.props

    if (item.isHeader) {
      return (
          <View style={styles.headerView}>
            <Text style={styles.headerText}>{item.title}</Text>
          </View>
      );
    } else {
      return (
          <View style={[gstyles.r_start, styles.item]}>
            <View style={[styles.itemLeft]}>
              {onEdit &&
              <CheckBox
                  containerStyle={styles.checkBox}
                  onPress={this._select}
                  checked={item.checked}
                  iconType='ionicon'
                  checkedIcon='ios-checkmark-circle'
                  uncheckedIcon='ios-radio-button-off'
                  checkedColor='#F29F3F'
              />
              }
              <Text style={[styles.word, {marginLeft:onEdit?0:10}]}>
                {item.content.word}
              </Text>
            </View>
            <View style={styles.itemCenter}>
              <TogglePane word={item.content.word}/>
            </View>
            <View style={[styles.itemRight]}>
              <AliIcon name='youjiantou' size={26} color='#C9C9C9'></AliIcon>
            </View>
          </View>

      );
    }
  }
}