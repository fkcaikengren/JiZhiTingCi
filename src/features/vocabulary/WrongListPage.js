import React from "react";
import { FlatList , View, Text, StyleSheet, Image} from "react-native";
import { CheckBox } from 'react-native-elements'
import {connect} from 'react-redux'

import AliIcon from '../../component/AliIcon';
import {selectedImg , circleImg} from '../../image';
import gstyles from '../../style'
import styles from './VocaListStyle'
import * as VocaListAction from './redux/action/vocaListAction'
import VocaTaskService from './service/VocaTaskService'

class WrongListPage extends React.Component {
  constructor() {
    super();
    this.state = {
      data:[],
      stickyHeaderIndices: []
    };

    this.vtService = new VocaTaskService()
  }
  componentWillMount() {
    //获取数据
    const data = this.vtService.getWrongList()
    console.log(data)
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

  _selectItem = (index)=>{
    const data = [...this.state.data]
    data[index].checked = true
    this.setState({data})
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
                uncheckedIcon='ios-checkmark-circle-outline'
                checkedColor='#F29F3F'
                />
            }
            <Text style={[styles.word, {marginLeft:onEdit?0:10}]}>
              {item.content.word}
            </Text>
          </View>
          <View style={styles.itemCenter}><Text numberOfLines={1}>详细释义; v.喜欢，怎样，来；n.中国人</Text></View>
          <View style={[styles.itemRight]}>
            <AliIcon name='youjiantou' size={26} color='#C9C9C9'></AliIcon>
          </View>
        </View>
        
      );
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          stickyHeaderIndices={this.state.stickyHeaderIndices}
          extraData={this.props.vocaList} 
             
        />
      </View>
    );
  }
}


const mapStateToProps = state =>({
  vocaList: state.vocaList
});

const mapDispatchToProps = {
  toggleEdit: VocaListAction.toggleEdit
}

export default connect(mapStateToProps,mapDispatchToProps )(WrongListPage);