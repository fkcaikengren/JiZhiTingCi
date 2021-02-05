import React, { Component } from "react";
import { ScrollView,TouchableOpacity,FlatList, View, Text } from "react-native";
import { Button } from 'react-native-elements'
import PropTypes from 'prop-types'
import CardView from 'react-native-cardview'
import BackgroundTimer from 'react-native-background-timer'

import * as Constant from './common/constant'
import AliIcon from '../../component/AliIcon';
import gstyles from '../../style'
import styles from './VocaListStyle'
import VocaTaskService from './service/VocaTaskService'
import VocaUtil from "./common/vocaUtil";
import WordCell from "./component/WordCell";
import { COMMAND_MODIFY_PASSED } from "../../common/constant";
import Accordion from "react-native-collapsible/Accordion";

const GroupWordCount = 30
const ITEM_HEIGHT = styles.item.height;         //item的高度
const HEADER_HEIGHT = styles.headerView.height; //分组头部的高度
const SEPARATOR_HEIGHT = 0;                     //分割线的高度
const Dimensions = require('Dimensions');
const { width } = Dimensions.get('window');


export default class VocaListPage extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      stickyHeaderIndices: [],
      checked: false, //是否有被选的
      activeSections:[],
      newGroups: [],
    };
    this.vtService = new VocaTaskService()
  }

  componentWillMount() {
    this._init()
  }


  shouldComponentUpdate(nextProps, nextState) {
    const { data, checked, isVocaModalOpen,activeSections } = this.state
    const { onEdit } = this.props.vocaList
    if (onEdit == true && nextProps.vocaList.onEdit == false) {
      //清理check
      this._cancleCheck()
      return false
    }

    if (this.props.index !== this.props.pageIndex) {
      return false
    }

    //刷新的因素：data,checked,onEdit
    if (data === nextState.data && checked === nextState.checked 
      && activeSections===nextState.activeSections && onEdit === nextProps.vocaList.onEdit ) {
      return false
    } else {
      return true
    }

  }

  _init = () => {
    //获取数据
    let data = []
    switch (this.props.type) {
      case Constant.WRONG_LIST:
        data = this.vtService.getWrongList()
        break;
      case Constant.PASS_LIST:
        data = this.vtService.getPassList()
        break;
      case Constant.LEARNED_LIST:
        data = this.vtService.getLearnedList()
        break;
      case Constant.NEW_LIST:
        {
          const newGroups = []
          data = this.vtService.getNewList()
          const max = data.length/GroupWordCount
          for(let i=0;i<max;i++){
            newGroups.push({checked: false, groupIndex:i})
          }
          for(let i=0;i<data.length;i++){
            data[i].index=i
          }
          this.setState({
            data:data,
            newGroups
          });
          return
        }
    }

    const headers = [];
    for (let item of data) {
      if (item.isHeader) {
        headers.push(data.indexOf(item));
      }
    }
    // headers.push(0);
    this.setState({
      data: data,
      stickyHeaderIndices: headers
    });
  }

  // 取消check
  _cancleCheck = () => {
    const data = [...this.state.data]
    for (let d of data) {
      d.checked = false
    }
    this.setState({ data, checked: false })

  }

  //多选
  _selectItem = (index) => {
    console.log('change state --' + index)

    const data = [...this.state.data]
    let checked = this.state.checked
    if (data[index].checked) {//取消
      data[index] = { ...data[index], checked: false }
      let exist = false
      //遍历判断是否存在被选中的
      for (let d of data) {
        if (d.checked) {
          exist = true
          break;
        }
      }
      if (!exist) {
        checked = false
      }
    } else {                  //选中
      data[index] = { ...data[index], checked: true }
    }
    //如果首次被选
    if (this.state.checked == false) {
      checked = true
    }
    this.setState({ data, checked })


  }

  _lookDetail = (index) => {
    //导航到详情页
    this.props.navigation.navigate('VocaDetail', {
      word: this.state.data[index].word
    })
  }

  _renderItem = ({ item, index }) => {
    return <WordCell item={item} index={index} onEdit={this.props.vocaList.onEdit}
      selectItem={this._selectItem} lookDetail={this._lookDetail} />
  };

  // 
  _renderAccordionContent = (g)=>{
    const index = g.groupIndex
    if(this.state.activeSections[0]!=index){
      return <View></View>
    }
    const startIndex = index*GroupWordCount
    const datas = this.state.data.slice(startIndex,startIndex+GroupWordCount)
    const endIndex = startIndex+GroupWordCount - 1
    console.log(g.groupIndex);
    console.log(startIndex+'-->'+endIndex);
    return <View >
        {this.props.vocaList.onEdit &&
          <TouchableOpacity activeOpacity={0.8} 
            onPress={() => { 
              const newData =  this.state.data.map(d=>{
                if(d.index>=startIndex && d.index<=endIndex){
                  d.checked = true
                }
                return d
              })
              this.setState({
                data: newData,
                checked: true
              })
            }}>
              <Text style={{color:gstyles.infoColor,height:32,lineHeight:32,fontSize:16,backgroundColor:'#E0E0E0',paddingLeft:10}}>
                全选
              </Text>
          </TouchableOpacity>
        }
        {datas && datas.length>0 &&
          datas.map(item=>{
            //item: { isHeader: false, checked: false, word: 'envy' }
            return <WordCell  item={item} 
                              index={item.index} 
                              onEdit={this.props.vocaList.onEdit}
                              selectItem={this._selectItem} 
                              lookDetail={this._lookDetail} />
          })
        }
    </View>
  }



  _dealWords = () => {

    if (this.props.type === Constant.PASS_LIST) {
      const wordArr = []
      const syncArr = []
      let words = []
      let taskOrder = null
      for (let item of this.state.data) {
        if (item.taskOrder !== taskOrder) {
          //把之前的放入数组
          if (taskOrder) {
            wordArr.push({
              taskOrder,
              words
            })
          }
          words = []
          taskOrder = item.taskOrder
        }
        if (item.checked) {
          words.push(item.word)
          syncArr.push({
            taskOrder: item.taskOrder,
            word: item.word,
            passed: false
          })
        }
      }
      if (taskOrder) {
        wordArr.push({
          taskOrder,
          words
        })
      }
      if (wordArr.length <= 0) {
        this.props.toast.show('请选择单词', 1000)
        return
      }
      //还原单词
      if (this.vtService.dispassWords(wordArr)) {
        //上传pass
        this.props.syncTask({
          command: COMMAND_MODIFY_PASSED,
          data: syncArr
        })
        this.props.toast.show('还原Pass的单词成功', 1000)
        this._init()
      } else {
        this.props.toast.show('还原Pass的单词失败', 1000)
      }
    } else {
      const data = this.state.data.filter((item, index) => {
        if (item.checked === true) {
          return true
        } else {
          return false
        }
      })
      const words = data.map((item, index) => item.word)
      if (words.length < Constant.MIN_PLAY_NUMBER) {
        this.props.toast.show('当前选择不足5个，不可以播放哦', 2000)
      } else {
        const virtualTask = VocaUtil.genVirtualTask(words, '来源：单词列表')
        // console.log(virtualTask)

        //暂停
        const { autoPlayTimer, } = this.props.vocaPlay
        if (autoPlayTimer) {
          BackgroundTimer.clearTimeout(autoPlayTimer);
          this.props.changePlayTimer(0);
        }

        this.props.navigation.navigate('VocaPlay', {
          task: virtualTask,
          mode: Constant.NORMAL_PLAY,
          normalType: Constant.BY_VIRTUAL_TASK,
        });
      }
    }
  }


  //data:item数组, index: item的下标
  _getItemLayout = (data, index) => {
    let length = ITEM_HEIGHT
    const { stickyHeaderIndices } = this.state
    if (stickyHeaderIndices.includes(index)) {
      length = HEADER_HEIGHT
    }
    //  计算几个header,设计偏移量算法
    let headerCount = 0;
    for (let i in stickyHeaderIndices) {
      if (stickyHeaderIndices[i] < index) {
        headerCount++;
      } else {
        break;
      }
    }
    const offset = (index - headerCount) * (ITEM_HEIGHT + SEPARATOR_HEIGHT) + headerCount * (HEADER_HEIGHT + SEPARATOR_HEIGHT)
    return { index, offset, length };
  }

  _keyExtractor = (item, index) => {
    if (item.word) {
      return item.word + index
    } else {
      return item.title + index.toString()
    }
  }



  render() {

    let title = ''
    let iconName = 'Home_tv_x'
    let noData = '暂无数据'
    switch (this.props.type) {
      case Constant.WRONG_LIST:
        title = '播放'
        noData = '没有错词哦'
        break;
      case Constant.PASS_LIST:
        title = '还原'
        iconName = 'huanyuan'
        noData = '没有pass过单词哦'
        break;
      case Constant.LEARNED_LIST:
        title = '播放'
        noData = '没有学过的单词哦'
        break;
      case Constant.NEW_LIST:
        title = '播放'
        noData = '没有未学的单词哦'
        break;
    }

    const playIconColor = this.state.checked ? gstyles.mainColor : '#999'
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, marginBottom: this.props.vocaList.onEdit ? 60 : 0 }}>
          {this.state.data.length > 0 && this.props.type!=Constant.NEW_LIST &&
            <FlatList
              data={this.state.data}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              stickyHeaderIndices={this.state.stickyHeaderIndices}
              getItemLayout={this._getItemLayout}
              extraData={this.props.vocaList.onEdit}
            />
          }
          {this.state.data.length > 0 && this.props.type==Constant.NEW_LIST &&
            <ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={gstyles.c_start}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
            >
              <Accordion
                style={{width:width}}
                activeSections={this.state.activeSections}
                sections={this.state.newGroups}
                renderHeader={(g)=>{
                  const title = '未学列表-'+(g.groupIndex+1)
                  const expand = this.state.activeSections.includes(g.groupIndex)
                  return <View style={styles.accordionItem}>
                    <Text style={styles.accordionTitle}>{title}</Text>
                    <AliIcon name={expand ? 'youjiantou-copy' : 'youjiantou'} size={24} color='#888' style={{ marginRight: 16 }} />
                  </View>
                }}
                renderContent={this._renderAccordionContent}
                onChange={activeSections => {
                  this.setState({ activeSections });
                }}
              />
            </ScrollView>
          }
          {this.state.data.length <= 0 &&
            <View style={[gstyles.c_center, { flex: 1 }]}>
              <AliIcon name={'nodata_icon'} size={60} color={gstyles.black} />
              <Text style={gstyles.md_black}>{noData}</Text>
            </View>
          }
        </View>
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
              icon={<AliIcon name={iconName} size={26} color={playIconColor} style={{ marginRight: 10 }} />}
              title={title}
              titleStyle={[gstyles.md_black, { fontWeight: '500', lineHeight: 24 }]}
              onPress={this._dealWords}
              containerStyle={{ width: '100%' }}
            >
            </Button>
          </CardView>
        }
      </View>
    );
  }
}

VocaListPage.propTypes = {
  type: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  toast: PropTypes.object
};
