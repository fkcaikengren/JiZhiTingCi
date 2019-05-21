import React, { PureComponent } from 'react';
import { Platform, Dimensions, StyleSheet ,View,  FlatList, StatusBar, TouchableOpacity, TouchableNativeFeedback} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text,
    Grid, Col, Row, Card, CardItem, ListItem, SwipeRow,  Switch, Left, Right, Body,
} from 'native-base';
// import {connect} from 'react-redux';
// import Swipeout from 'react-native-swipeout';


// import SoundsPool from '../component/SoundsPool';
// import {PlayType} from '../constant/VocConstant';
// import {changeSelectedPlayIndex,loadVocGroupList, changePlayType} from '../redux/actions/wordReview'
const { width, height } = Dimensions.get('window');
const ITEM_H = 55;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    item: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',

        width:width,
        height: ITEM_H,
        backgroundColor:'#FFFFFF00'
    },
    
    playItemView:{
        
    },
    playItemText:{
        color:'#FF3C2B',
        fontSize:26,
    },
    itemText:{
        color:'#FFFFFFAA',
    }
})

/**
 *Created by Jacy on 19/03/28.
 */
export default class VocaPlayList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          
        }
        // this.soundsPool = new SoundsPool();
    }

    //组件加载完毕
    componentDidMount() {
        // 加载数据
        // this.props.loadVocGroupList(1);
       
    }

    // componentDidUpdate(){
    //     const {vocs,selectedPlayIndex, playType ,autoplayTimer } = this.props;
    //     // 开始播放
    //     switch(playType){
    //         case PlayType.PLAYING:{
    //             break;
    //         }
    //         case PlayType.TOPAUSE:{
                
    //             break;
    //         }
    //         case PlayType.PAUSED:{
                
    //             break;
    //         }
    //         case PlayType.FIRSTPLAY :{
    //             this.soundsPool.init(vocs, selectedPlayIndex, ()=>{
    //                 this._autoplay(selectedPlayIndex, vocs);
    //                 //改变playType
    //                 this.props.changePlayType(PlayType.PLAYING);
    //                 //滚动初始index
    //                 // if (index !== 0) {
    //                 //     this._scrollToIndex( false, index);
    //                 // }
    //             });
    //             break;
    //         }
    //         case PlayType.REPLAY:{
    //             break;
    //         }
    //     }
        
            

       
    // }


    // componentWillUnmount() {
    //     if (this.autoplayTimer) {
    //         clearTimeout(this.autoplayTimer);
    //     }
    // }



    /**
     * @description 渲染item
     * @memberof VerticalSwiper
     */
    _renderItem = ({item, index}) =>{
        // const {review, playType ,selectedPlayIndex} = this.props;
        // let playItemView = {};
        // let playItemText = {};
        // if(selectedPlayIndex == index){
        //     playItemView = styles.playItemView;
        //     playItemText = styles.playItemText;
        // }
        // var swipeoutBtns = [
        //     {
        //         text: '移除',
        //         // backgroundColor:'red',
        //         // color:'white',
        //         type:'delete',
        //     }
        // ]

        // let translation = '';
        // item.trans.map((t, index, map)=>{
        //     translation += t.type+'.\t'+t.tran + '\t';
        // })

        return (
       
        <View style={styles.item}>
            <Text style={[styles.itemText,]}>{item.word}</Text>
                <Text note numberOfLines={1} style={[styles.itemText,]}>
                {item.tran}
            </Text>
        </View>
            
                
           
        );
    }
    

    


    /**
     * @description 自动播放 
     * @memberof SwiperFlatList
     */
    _autoplay = (index, vocs) => {
        // const { autoplayDelay} = this.props;
        // if (this.autoplayTimer) {
        //     clearTimeout(this.autoplayTimer);
        // }
        // //播放单词音频
        // this.soundsPool.play(vocs, index);

        // //循环回调
        // this.autoplayTimer = setTimeout(() => {
        //     const nextIndex = (index + 1) % vocs.length;
        //     this._scrollToIndex( true, nextIndex, vocs);
            
        // }, autoplayDelay * 1000);
    };
  
    /**
     * @description  滚动到指定index， 定时回调_autoplay
     * @memberof VerticalSwiper
     */
    _scrollToIndex = ( animated = true,index, vocs) => {
        // const { playType} = this.props;
        
        // // {animated: boolean是否动画, index: item的索引, viewPosition:视图位置（0-1） };
        // let params = { animated, index, viewPosition:0.5 };
        // if (this.flatListRef) {
        //     this.flatListRef.scrollToIndex(params);
            
        // }

        // // 回调自动播放
        // if (playType === PlayType.PLAYING) {
        //     this._autoplay(index, vocs);  
        // }

        // //修改页面索引状态
        // this.props.changeSelectedPlayIndex(index, this.autoplayTimer);
        
    }



    _keyExtractor = (item, index) => index.toString();

    _onScrollToIndexFailed = info => {
        setTimeout(() => this._scrollToIndex( false, info.index, info.vocs));
    };

   


    // length: item高度； offset: item的父组件的偏移量
    _getItemLayout = (data, index) =>{
        return ({ length: ITEM_H, offset: ITEM_H * index, index });
    } 

  
        

    render(){
        // const  {listName,vocs, selectedPlayIndex, playType, autoplayDelay} = this.props;
        const flatListProps = {
            ref: component => {
                this.flatListRef = component;
            },

            horizontal: false,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            pagingEnabled: false,

            // extraData: {listName,vocs, selectedPlayIndex, playType, autoplayDelay},
            keyExtractor: this._keyExtractor,

            // data: vocs,
            data:[{word:'hello',tran:'嗨'},{word:'communication',tran:'沟通'}, {word:'hell',tran:'地狱'}, ],
            renderItem: this._renderItem,
            
            onScrollToIndexFailed: this._onScrollToIndexFailed,
            initialNumToRender: 16,
            getItemLayout: this._getItemLayout,
            
        }
        return(
            <FlatList
                {...flatListProps}
               
            />
        );
    }
}

let i = 1;

// const mapStateToProps = state =>({
//     vocs:state.wordReview.vocGroup.vocs,
//     listName:state.wordReview.vocGroup.listName,
//     selectedPlayIndex:state.wordReview.selectedPlayIndex, 
//     playType:state.wordReview.playType,
//     autoplayDelay:state.wordReview.autoplayDelay,
//     autoplayTimer:state.wordReview.autoplayTimer,
// });
// const mapDispatchToProps = {
//     loadVocGroupList,
//     changeSelectedPlayIndex,
//     changePlayType,
// };
// export default connect(mapStateToProps,mapDispatchToProps )(VerticalSwiper);
