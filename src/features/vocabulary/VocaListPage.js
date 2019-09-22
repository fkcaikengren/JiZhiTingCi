import React from "react";
import { FlatList , View, Text,} from "react-native";
import { CheckBox , Button} from 'react-native-elements'
import BackgroundTimer from 'react-native-background-timer';
import PropTypes from 'prop-types'
import CardView from 'react-native-cardview'

import TogglePane from './component/TogglePane'
import * as Constant from './common/constant'
import AliIcon from '../../component/AliIcon';
import gstyles from '../../style'
import styles from './VocaListStyle'
import * as VocaListAction from './redux/action/vocaListAction'
import VocaTaskService from './service/VocaTaskService'
import VocaUtil from "./common/vocaUtil";


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
      return item
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

    if(this.props.index !== this.props.pageIndex){
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
    
    if (item.isHeader) {
      return (
        <View style={styles.headerView}
        >
          <Text style={styles.headerText}>{item.title}</Text>
        </View>
      );
    } else {
      const onEdit = (this.props.vocaList.onEdit )
      return (
        <View style={[gstyles.r_start, styles.item]}>
          <View style={[styles.itemLeft]}>
            {onEdit &&
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
            <TogglePane word={item.content.word}/>
          </View>
          <View style={[styles.itemRight]}>
            <AliIcon name='youjiantou' size={26} color='#C9C9C9'></AliIcon>
          </View>
        </View>
        
      );
    }
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
        console.log(virtualTask)

        //暂停
        const {autoPlayTimer, } = this.props.vocaPlay
        if(autoPlayTimer){
          BackgroundTimer.clearTimeout(autoPlayTimer);
          this.props.changePlayTimer(0);
        }

        this.props.navigation.navigate('VocaPlay',{
          task:virtualTask, 
          mode:Constant.NORMAL_PLAY,
          normalType: Constant.BY_VIRTUAL_TASK
        });
      }

    }
  }
  

  render() {
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
              keyExtractor={(item, index) => index.toString()}
              stickyHeaderIndices={this.state.stickyHeaderIndices}
              extraData={this.props.vocaList}

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




