import React, { Component } from "react";
import { View, Text, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import Swiper from 'react-native-swiper'
import { Header, Badge } from 'react-native-elements'
import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import VocaLibPage from "./VocaLibPage";
import { TYPE_VOCA_BOOK_WORD, TYPE_VOCA_BOOK_READ, TYPE_VOCA_BOOK_PHRASE } from "./common/constant";
import _util from '../../common/util'

class VocaLibTabPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageIndex: 0,
        }
    }

    _movePage = (clickIndex) => {
        this.swiperRef.scrollBy(clickIndex - this.state.pageIndex, true)
    }
    _onIndexChanged = (index) => {
        this.setState({ pageIndex: index })
    }

    render() {
        const selectTextStyle = [{ borderBottomWidth: 2, borderBottomColor: gstyles.black }, gstyles.sm_black_bold]
        const index = this.state.pageIndex
        return (
            <View style={{ flex: 1 }}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();

                        }} />}

                    centerComponent={{ text: '词库', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        borderBottomColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                {/* 导航栏 */}
                <View style={gstyles.tabBar}>
                    <View style={gstyles.tabBtn}
                        onStartShouldSetResponder={() => true}
                        onResponderStart={(e) => { this._movePage(0) }}
                    >
                        <Text style={[gstyles.sm_gray, gstyles.tabText, index === 0 ? selectTextStyle : null]}>单词</Text>
                    </View>
                    <View style={gstyles.tabBtn}
                        onStartShouldSetResponder={() => true}
                        onResponderStart={(e) => { this._movePage(1) }}
                    >
                        <View>
                            <Text style={[gstyles.sm_gray, gstyles.tabText, index === 1 ? selectTextStyle : null]}>阅读词汇</Text>
                            <Badge
                                status="error"
                                value="推荐"
                                textStyle={{ fontSize: 8, fontWeight: "bold" }}
                                containerStyle={{ position: 'absolute', top: -8, right: -18 }}
                            />
                        </View>
                    </View>
                    <View style={gstyles.tabBtn}
                        onStartShouldSetResponder={() => true}
                        onResponderStart={(e) => { this._movePage(2) }}
                    >
                        <View>
                            <Text style={[gstyles.sm_gray, gstyles.tabText, index === 2 ? selectTextStyle : null]}>词组</Text>
                            <Badge
                                status="error"
                                value="付费"
                                textStyle={{ fontSize: 8, fontWeight: "bold" }}
                                containerStyle={{ position: 'absolute', top: -8, right: -18 }}
                            />
                        </View>
                    </View>
                </View>
                {/* 词库页面 */}
                <Swiper
                    ref={ref => this.swiperRef = ref}
                    showsPagination={false}
                    loop={false}
                    onIndexChanged={this._onIndexChanged}
                    index={this.state.pageIndex}
                    loadMinimal loadMinimalSize={3}
                >
                    <VocaLibPage {...this.props}
                        index={0}
                        pageIndex={this.state.pageIndex}
                        vocaBookType={TYPE_VOCA_BOOK_WORD}
                    />
                    <VocaLibPage {...this.props}
                        index={1}
                        pageIndex={this.state.pageIndex}
                        vocaBookType={TYPE_VOCA_BOOK_READ}
                    />
                    <VocaLibPage {...this.props}
                        index={2}
                        pageIndex={this.state.pageIndex}
                        vocaBookType={TYPE_VOCA_BOOK_PHRASE}
                    />
                </Swiper>

            </View>


        );
    }
}

export default VocaLibTabPage