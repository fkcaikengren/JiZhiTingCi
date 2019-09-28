

import React, {Component} from 'react';
import {FlatList } from 'react-native';
const SwipeableRow = require('SwipeableRow');

class SwipeableFlatList extends React.Component {


  static defaultProps = {
    ...FlatList.defaultProps,
    bounceFirstRowOnMount: true,
    renderQuickActions: () => null,
    onOpen: (key) => null,
    onClose: () => null,
  };

  constructor(props) {
    super(props);
    this.state = {
      openRowKey: null,
    };

    this._shouldBounceFirstRowOnMount = this.props.bounceFirstRowOnMount;
  }

  render(){
    return (
      <FlatList
        {...this.props}
        ref={ref => {
          this._flatListRef = ref;
        }}
        onScroll={this._onScroll}
        renderItem={this._renderItem}
        extraData={this.state}
      />
    );
  }

  //关闭滑块
  closePassBtn = ()=>{
    if(this.state.openRowKey !== null){
      this.setState({
        openRowKey: null,
      });
    }
  }

  //滑动
  scrollToIndex = (param)=>{
    this._flatListRef.scrollToIndex(param)
  }

  //获取打开的滑块
  getOpenedRowKey = ()=>{
    return this.state.openRowKey
  }

  _onScroll = (e) => {
    // Close any opens rows on ListView scroll
    if (this.state.openRowKey) {
      this.props.onClose()
      this.setState({
        openRowKey: null,
      });
    }

    this.props.onScroll && this.props.onScroll(e);
  };

  _renderItem = (info)=> {
      const slideoutView = this.props.renderQuickActions(info);
      const key = this.props.keyExtractor(info.item, info.constant);

      // If renderQuickActions is unspecified or returns falsey, don't allow swipe
      if (!slideoutView) {
        return this.props.renderItem(info);
      }

      let shouldBounceOnMount = false;
      if (this._shouldBounceFirstRowOnMount) {
        this._shouldBounceFirstRowOnMount = false;
        shouldBounceOnMount = true;
      }

      return (
        <SwipeableRow
          preventSwipeRight={true}
          slideoutView={slideoutView}
          isOpen={key === this.state.openRowKey}
          maxSwipeDistance={this._getMaxSwipeDistance(info)}
          onOpen={() => { 
            this.props.onOpen(key)
            this.setState({
              openRowKey: key,
            });
          }}
          onClose={() => {
            this.props.onClose()
            this.setState({
              openRowKey: null,
            });
          }}
          shouldBounceOnMount={shouldBounceOnMount}
          onSwipeEnd={()=>{
            
            this._setListViewScrollableTo(true);
          }}
          onSwipeStart={()=>{
              this._setListViewScrollableTo(false);
          }}>
          {this.props.renderItem(info)}
        </SwipeableRow>
      );
    
  };

  // This enables rows having variable width slideoutView.
  _getMaxSwipeDistance(info) {
    if (typeof this.props.maxSwipeDistance === 'function') {
      return this.props.maxSwipeDistance(info);
    }

    return this.props.maxSwipeDistance;
  }

  _setListViewScrollableTo(value) {
    if (this._flatListRef) {
      this._flatListRef.setNativeProps({
        scrollEnabled: value,
      });
    }
  }



}

export default SwipeableFlatList;
