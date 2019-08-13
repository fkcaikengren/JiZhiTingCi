import React from "react";
import { FlatList , View, Text,} from "react-native";
import { CheckBox , Button} from 'react-native-elements'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import TogglePane from './component/TogglePane'
import * as Constant from './common/constant'
import AliIcon from '../../component/AliIcon';
import gstyles from '../../style'
import styles from './VocaListStyle'
import * as VocaListAction from './redux/action/vocaListAction'
import VocaTaskService from './service/VocaTaskService'


export default class VocaListPage extends React.Component {
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
    });
    headers.push(0);
    this.setState({
      data: data,
      stickyHeaderIndices: headers
    });
  }


  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.vocaList.onEdit == true && nextProps.vocaList.onEdit == false){
      //清理check
      this._cancleCheck()
      return false
    }
    return true
  }

  // 取消check
  _cancleCheck = ()=>{
    const data = [...this.state.data]
    for(let d of data){
      d.checked = false
    }
    this.setState({data, checked:false})
  }

  //多选
  _selectItem = (index)=>{
    const data = [...this.state.data]
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
    this.setState({data, checked})
  }

  renderItem = ({ item, index }) => {
    const {onEdit} = this.props.vocaList
    if (item.isHeader) {
      return (
        <View style={styles.headerView}
        >
          <Text style={styles.headerText}>{item.title}</Text>
        </View>
      );
    } else {
      return (
        <View style={[gstyles.r_start, styles.item]}>
          <View style={[styles.itemLeft]}>
            {this.props.vocaList.onEdit &&
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
            <Text style={[styles.word, {marginLeft:onEdit?0:10}]}>
              {item.content.word}
            </Text>
          </View>
          <View style={styles.itemCenter}>
            <TogglePane content='v.这是一个单词，喜欢，吃喝'/>
          </View>
          <View style={[styles.itemRight]}>
            <AliIcon name='youjiantou' size={26} color='#C9C9C9'></AliIcon>
          </View>
        </View>
        
      );
    }
  };
  
  render() {
    let title = ''
    
    switch(this.props.type){
      case Constant.WRONG_LIST:
          title='开始测试'
      break;
      case Constant.PASS_LIST:
          title='一键还原'
      break;
      case Constant.LEARNED_LIST:
          title='开始测试'
      break;
      case Constant.NEW_LIST:
          title='开始测试'
      break;

    }

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          stickyHeaderIndices={this.state.stickyHeaderIndices}
          extraData={this.props.vocaList} 
             
        />
        {this.props.vocaList.onEdit &&
          <Button
            containerStyle={styles.bottomBtn}
            buttonStyle={{ backgroundColor:'#FFE957',}}
            disabled={!this.state.checked}
            title={title}
            type="solid"
          />
        } 
      </View>
    );
  }
}

VocaListPage.propTypes = {
  type: PropTypes.string.isRequired,
};




