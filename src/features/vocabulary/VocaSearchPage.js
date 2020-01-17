import React, { Component } from 'react';
import { StatusBar, FlatList, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import VocaDao from './service/VocaDao'
import VocaGroupDao from './service/VocaGroupDao'
import styles from './VocaSearchStyle'
import gstyles from '../../style'
import AliIcon from '../../component/AliIcon'
import VocaUtil from './common/vocaUtil';
import VocaCard from './component/VocaCard';
import LookWordBoard from "./component/LookWordBoard";
import { CARD_TYPE_WORD, CARD_TYPE_PHRASE } from './common/constant';

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
      cardType: CARD_TYPE_WORD,
      selectedIndex: null,
      showClearBtn: false,
    }
    this.vocaDao = VocaDao.getInstance()
    console.disableYellowBox = true;
  }

  componentDidMount() {
  }


  componentWillUnmount() {
  }

  _keyExtractor = (item, index) => index.toString();


  _renderItem = ({ item, index }) => {
    // 判断是单词or短语
    const isPhrase = this.state.cardType === CARD_TYPE_PHRASE
    const translation = isPhrase ? item.tran : VocaUtil.transToText(item.trans)
    return <TouchableOpacity onPress={() => {
      this.setState({ searchWord: isPhrase ? item.phrase : item.word, selectedIndex: index })
    }}>
      <View style={styles.item}>
        <View style={gstyles.r_start}>
          <Text style={[styles.contentText, { fontSize: 16, color: '#404040' }]}>{isPhrase ? item.phrase : item.word}</Text>
          <Text style={[styles.contentText, { fontSize: 12, color: '#999999' }]}>{isPhrase ? item.phonetic : item.enPhonetic}</Text>
        </View>
        <Text numberOfLines={1} style={[styles.contentText, { fontSize: 12, color: '#606060' }]}>{translation}</Text>
      </View>
    </TouchableOpacity>


  }



  _changeText = (searchText) => {
    let cardType = this.state.cardType
    if (searchText.replace(/^(\s*)/, '').includes(' ')) {
      cardType = CARD_TYPE_PHRASE
    } else {
      cardType = CARD_TYPE_WORD
    }
    const data = this.vocaDao.searchWord(searchText)
    const showClearBtn = searchText.length > 0 ? true : false
    this.setState({ searchText, data, cardType, showClearBtn })
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
                placeholder="请输入英文单词"
                onChangeText={this._changeText}
                clearButtonMode='while-editing'
                onFocus={this._onFocus}
                autoFocus
              />
            </View>
            {/* 清空图标 */}
            {this.state.showClearBtn &&
              <AliIcon name='guanbi' size={16} color='#666' style={styles.clearIcon}
                onPress={this._clear} />
            }
          </View>
          <TouchableWithoutFeedback onPress={() => { this.props.navigation.goBack() }}>
            <Text style={[gstyles.md_black, { paddingRight: 5 }]}>取消</Text>
          </TouchableWithoutFeedback>

        </View>
        {/* 搜索结果列表 */}
        {this.state.searchWord === '' &&
          <FlatList
            ref={ref => this._listRef = ref}
            data={this.state.data}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            extraData={this.state}
          />
        }

        {this.state.searchWord !== '' &&
          <VocaCard
            lookWord={this.wordBoard.lookWord}
            cardType={this.state.cardType}
            wordInfo={this.state.data[this.state.selectedIndex]}
            navigation={this.props.navigation}
          />
        }
        <LookWordBoard
          ref={ref => this.wordBoard = ref}
        />
      </View>
    );
  }
}