import React, { Component } from 'react';
import {
  StatusBar, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, BackHandler, Keyboard
} from 'react-native';
import dismissKeyboard from 'dismissKeyboard';

import VocaDao from './service/VocaDao'
import styles from './VocaSearchStyle'
import gstyles from '../../style'
import AliIcon from '../../component/AliIcon'
import VocaCard from './component/VocaCard';
import LookWordBoard from "./component/LookWordBoard";
import { store } from '../../redux/store';


const Dimensions = require('Dimensions');
let { width, height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;


export default class VocaSearchPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      data: [],
      searchWord: '',
      selectedIndex: null,
      showClearBtn: false,
    }
    this.vocaDao = VocaDao.getInstance()
    console.disableYellowBox = true;
  }

  componentDidMount() {
    //监听物理返回键
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const { isOpen, hide } = store.getState().app.commonModal
      if (isOpen()) {
        hide()
      } else {
        this.props.navigation.goBack()
      }
      return true
    })
  }

  componentWillUnmount() {
    this.backHandler && this.backHandler.remove('hardwareBackPress')
  }


  _renderItem = (item, index) => {
    return <TouchableOpacity onPress={() => {
      dismissKeyboard()
      this.setState({ searchWord: item.word, selectedIndex: index })
    }}>
      <View style={styles.item}>
        <View style={gstyles.r_start}>
          <Text style={[styles.contentText, { fontSize: 16, color: '#404040' }]}>{item.word}</Text>
          <Text style={[styles.contentText, { fontSize: 12, color: '#999999' }]}>{item.phonetic}</Text>
        </View>
        <Text numberOfLines={1} style={[styles.contentText, { fontSize: 12, color: '#606060' }]}>{item.translation}</Text>
      </View>
    </TouchableOpacity>


  }



  _changeText = (searchText) => {
    const data = this.vocaDao.searchWord(searchText)
    const showClearBtn = searchText.length > 0 ? true : false
    this.setState({ searchText, data, showClearBtn })
  }

  _clear = () => {
    this.setState({
      searchText: '',
      searchWord: ''
    });
    this._inputRef.focus()
  }


  _onFocus = (e) => {
    if (this.state.searchWord !== '') {
      this.setState({ searchWord: '' })
    }
  }



  render() {

    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent={true} />
        <View style={{ width: width, height: StatusBarHeight, backgroundColor: '#EFEFEF' }}></View>
        {/* 搜索栏 */}
        <View style={[gstyles.r_around, styles.searchBar]}>
          <View style={[gstyles.r_between, styles.inputWrapper]}>
            <View style={gstyles.r_start}>
              {/* 查找图标 */}
              <AliIcon name='chazhao1' size={20} color='#666' style={styles.searchIcon} />
              {/* 搜索框 */}
              <TextInput
                ref={ref => this._inputRef = ref}
                style={[{ height: 45, width: '80%' }, gstyles.md_black]}
                value={this.state.searchText}
                placeholder="请输入英文/中文"
                onChangeText={this._changeText}
                clearButtonMode='while-editing'
                onFocus={this._onFocus}
                autoFocus
              />
            </View>
            {/* 清空图标 */}
            {this.state.showClearBtn &&
              <AliIcon name='guanbi' size={18} color='#666' style={styles.clearIcon}
                onPress={this._clear} />
            }
          </View>
          <TouchableWithoutFeedback onPress={() => { this.props.navigation.goBack() }}>
            <Text style={[gstyles.md_black, { paddingRight: 5 }]}>取消</Text>
          </TouchableWithoutFeedback>

        </View>
        {/* 搜索结果列表 */}
        {this.state.searchWord === '' &&
          this.state.data.map(this._renderItem)
        }

        {this.state.searchWord !== '' &&
          <VocaCard
            navigation={this.props.navigation}
            lookWord={this.wordBoard.lookWord}
            wordInfo={this.state.data[this.state.selectedIndex]}
          />
        }
        <LookWordBoard
          ref={ref => this.wordBoard = ref}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}