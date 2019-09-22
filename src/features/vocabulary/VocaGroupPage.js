

'use strict';
import React, { Component } from "react";
import {StatusBar, View, Text, TouchableNativeFeedback, Alert, ScrollView,
    TextInput,Keyboard} from 'react-native';
import {Header, Button,Icon} from 'react-native-elements'
import Modal from 'react-native-modalbox';
import CardView from 'react-native-cardview'
import Toast, {DURATION} from 'react-native-easy-toast'

import AliIcon from '../../component/AliIcon';
import VocaGroupDao from './service/VocaGroupDao'
import styles from './VocaGroupStyle'
import gstyles from '../../style'
import DashSecondLine from '../../component/DashSecondLine'


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

export default class VocaGroupPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            vocaGroups:[],          //生词本数组
            inEdit:false,
            isAddModalOpen: false,
            isUpdateModalOpen: false,
            addName: '',
            updateName: '',
            selectedName: '',
            refresh: true,          //用来刷新
            keyboardSpace:0
          };
        this.vgDao = VocaGroupDao.getInstance();

        Keyboard.addListener('keyboardDidShow',(frames)=>{
            if (!frames.endCoordinates) return;
            this.setState({keyboardSpace: frames.endCoordinates.height});
        });
        Keyboard.addListener('keyboardDidHide',(frames)=>{
            this.setState({keyboardSpace:0});
        });
        console.disableYellowBox=true;
    }

    componentDidMount(){
        this._refreshGroup()
    }

    componentWillUnmount(){
    }

    

    //打开添加弹框
   _openAddModal = ()=>{
       this.setState({isAddModalOpen:true})
   }
   _closeAddModal = ()=>{
       this.setState({isAddModalOpen: false});
   }


   //打开修改弹框
   _openUpdateModal = ()=>{
        this.setState({isUpdateModalOpen:true})
    }
    _closeUpdateModal = ()=>{
        this.setState({isUpdateModalOpen: false});
    }

   

    //创建弹框
    _createModal = (isAdd) =>{
        return <Modal style={[styles.modal,gstyles.c_start,{
            //根据键盘调整位置
            top:this.state.keyboardSpace?-10-this.state.keyboardSpace: -(height/2)+100,
        }]}
                isOpen={isAdd?this.state.isAddModalOpen:this.state.isUpdateModalOpen} 
                onOpened={isAdd?this._openAddModal:this._openUpdateModal}
                onClosed={isAdd?this._closeAddModal:this._closeUpdateModal}
                backdrop={true}
                backdropPressToClose={true}
                position={'bottom'}
                ref={ref => {
                    isAdd
                    ?this._addModalRef = ref
                    :this._updateModalRef =ref
                }}>
            <View style={[gstyles.c_center,{height:'75%'}]}>
                <Text style={[gstyles.lg_black_bold]}>
                    {isAdd?'新建生词本':'修改生词本'}
                </Text>
                <TextInput
                    style={styles.inputStyle}
                    value={this.state.searchText}
                    placeholder="请输入生词本名称"
                    onChangeText={(name)=>{
                        isAdd
                            ?this.setState({addName:name})
                            :this.setState({updateName:name})
                    }}
                    autoFocus
                />
            </View>
            <DashSecondLine backgroundColor='#AAA' len={20} width={'100%'}/>
            <View style={[styles.modalBtnGroup,gstyles.r_around]}>
                <Button type='clear' onPress={isAdd?this._closeAddModal:this._closeUpdateModal}
                title='取消'
                titleStyle={gstyles.lg_gray}>
                </Button>
                <View style={{width:1,height:30,backgroundColor:'#303030'}}/>
                <Button type='clear' onPress={isAdd?this._addVocaGroup:this._updateVocaGroup}
                title='确定'
                titleStyle={gstyles.lg_black}
                >
                </Button>
            </View>
        </Modal>
    }

  
    _toggleEdit = ()=>{
        this.setState({inEdit:!this.state.inEdit})
    }

   //判断是否存在该名称的生词本
   _isNameExist = (name)=>{
        let isExist = false;
        for(let g of this.state.vocaGroups){
            if(g.groupName === name){
                isExist = true;
                break;
            }
        }
        return isExist
   }

   //添加生词本
   _addVocaGroup = ()=>{
        
        this._closeAddModal();
        //循环
        let isExist = this._isNameExist(this.state.addName);
        //添加生词本
        if(this.state.addName === ''){
            this.refs.toast.show('名称不能为空，添加失败', 1000);
        }else if(isExist){
            this.refs.toast.show('重名了，添加失败', 1000);
        }else{
            this.vgDao.addGroup(this.state.addName)
            this.setState({addName:''});
            this.refs.toast.show('添加成功', 500);
            
        }
   }

   //修改生词本
   _updateVocaGroup = () =>{
        this._closeUpdateModal()
        let isExist = this._isNameExist(this.state.updateName);
         //添加生词本
        if(this.state.updateName === ''){
            this.refs.toast.show('名称不能为空，修改失败', 1000);
        }else if(isExist){
            this.refs.toast.show('重名了，修改失败', 1000);
        }else{
            this.vgDao.updateGroupName(this.state.selectedName, this.state.updateName);
            this.setState({updateName:'',selectedName:''})
            this.refs.toast.show('修改成功', 500);
        }
   }

    //删除生词本
    _deleteVocaGroup = (deleteName) =>{
        //默认生词本不能删除
        if(this.vgDao.isDefault(deleteName)){
            this.refs.toast.show('无法删除默认生词本', 1000 );
        }else{
            this.vgDao.deleteGroup(deleteName)
            this.refs.toast.show('删除成功', 500);
            this.setState({refresh:!this.state.refresh})
        }
    }

    // 刷新
    _refreshGroup = ()=>{
        const vocaGroups = this.vgDao.getAllGroups();
        console.log('all groups:')
        console.log(vocaGroups.length)
        if(vocaGroups.length == 0){
            this.vgDao.addGroup('默认生词本')
            this.vgDao.updateToDefault('默认生词本')
        }
        this.setState({vocaGroups})
    }


    render() {

        return (
            <View style={styles.container}>
                <StatusBar translucent={true} />
                <Header
                statusBarProps={{ barStyle: 'dark-content' }}
                barStyle='dark-content' // or directly
                leftComponent={ 
                    <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={()=>{
                        this.props.navigation.goBack();
                    }}></AliIcon> }
                rightComponent={ <AliIcon name='tongbu' size={24} color={gstyles.black} />}
                centerComponent={{ text: '生词本', style: gstyles.lg_black_bold }}
                containerStyle={{
                    backgroundColor: gstyles.mainColor,
                    justifyContent: 'space-around',
                }}
                />
                {/* 生词本列表 */}
                <View style={styles.content}>
                    <ScrollView style={{flex: 1, paddingBottom:40}}
                    pagingEnabled={false}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    >
                        {this.state.vocaGroups.map((item, index)=>{
                            //判断是什么类型的生词本
                            return (
                                <TouchableNativeFeedback disabled={this.state.inEdit} key={index} onPress={()=>{
                                    //加载生词
                                    this.props.navigation.navigate('GroupVoca',{
                                        groupName:item.groupName,
                                        refreshGroup:this._refreshGroup
                                    });
                                        
                                }}>
                                    <View style={styles.groupItem}>
                                        <View style={[gstyles.r_start, {flex:1,}]}>
                                            <View style={styles.iconBg}>
                                                <Text style={gstyles.md_black_bold}>
                                                    {item.groupName[0]}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text numberOfLines={1} style={[{marginLeft:10},gstyles.lg_black]}>{item.groupName}</Text>
                                                <Text style={[{marginLeft:10},gstyles.sm_gray]}>共{item.count}词</Text>
                                            </View>
                                        </View>
                                        {!this.state.inEdit &&  item.isDefault &&
                                            <AliIcon name='pingfen' size={26} color={gstyles.secColor}  style={{marginRight:10}}/>
                                        }
                                        {this.state.inEdit &&
                                            <View style={[gstyles.r_center, {flex:1}]}>
                                                <View style={[gstyles.r_center, {flex:1, justifyContent:'flex-end'}]}>
                                                    {/* 设置为默认生词本 */}
                                                    <AliIcon name={item.isDefault?'pingfen':'malingshuxiangmuicon-'} color={item.isDefault?'#F29F3F':'#888'} size={26} onPress={()=>{
                                                        if(!item.isDefault){ //不是默认
                                                            this.vgDao.updateToDefault(item.groupName)
                                                            this.setState({refresh:!this.state.refresh})
                                                        }
                                                        }}/>
                                                    {/* 修改 */}
                                                    <TouchableNativeFeedback onPress={()=>{
                                                        this.setState({isUpdateModalOpen:true,selectedName:item.groupName})
                                                    }}>
                                                        <Text style={{fontSize:14, color:'#1890FF', marginHorizontal:10}}>修改名称</Text>
                                                    </TouchableNativeFeedback>
                                                    {/* 删除 */}
                                                    <TouchableNativeFeedback onPress={()=>{
                                                        Alert.alert(
                                                            '删除生词本',
                                                            `是否删除${item.groupName}?`,
                                                            [
                                                            {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                            {text: '确认', onPress: () => {this._deleteVocaGroup(item.groupName)}}
                                                            ],
                                                            { cancelable: false }
                                                        )
                                                        
                                                    }}>
                                                        <Text style={{fontSize:14, color:'red', marginRight:10}}>删除</Text>
                                                    </TouchableNativeFeedback>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </TouchableNativeFeedback>
                            )
                            
                        })}

                    </ScrollView>   

                </View>
                {/* 添加 编辑*/}
                <CardView
                    cardElevation={5}
                    cardMaxElevation={5}
                    cornerRadius={20}
                    style={gstyles.footer}>
                        <View style={gstyles.r_around}>
                            <Button 
                            type="clear"
                            icon={ <Icon name="add"  size={24} color="#303030" />}
                            title='添加'
                            titleStyle={gstyles.md_black_bold}
                            onPress={this._openAddModal}>
                            </Button>
                            <View style={{width:1,height:20,backgroundColor:'#555'}}></View>
                            <Button 
                            type="clear"
                            icon={ <Icon name="edit"  size={20} color="#303030" />}
                            title={this.state.inEdit?'完成':'编辑'}
                            titleStyle={gstyles.md_black_bold}
                            onPress={this._toggleEdit}>
                            </Button>
                        </View>
                </CardView>
                <Toast
                    ref="toast"
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
                {
                    this._createModal(true) //创建添加弹框
                }
                {
                    this._createModal(false) //创建修改弹框
                }
            </View>    
        );
    }
}
