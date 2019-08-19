

'use strict';
import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text, TouchableNativeFeedback, Alert,
    ScrollView
} from 'react-native';
import {Header, Button,Icon, Input} from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modalbox';
import CardView from 'react-native-cardview'
import Toast, {DURATION} from 'react-native-easy-toast'

import AliIcon from '../../component/AliIcon';
import VocaGroupDao from './service/VocaGroupDao'
import styles from './VocaGroupStyle'
import gstyles from '../../style'


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

VocaGroupDao.getInstance().open()

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
          };
        this.vgDao = VocaGroupDao.getInstance();

        console.disableYellowBox=true;
    }

    componentDidMount(){
        let vocaGroups = this.vgDao.getAllGroups();
        console.log('all groups:')
        console.log(vocaGroups.length)
        if(vocaGroups.length == 0){
            this.vgDao.addGroup('默认生词本')
            this.vgDao.updateToDefault('默认生词本')
        }
        this.setState({vocaGroups})
       
    }

    componentWillUnmount(){
        // alert('vocaGroup out, close realm')
        this.vgDao.close()
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
        return <Modal style={[gstyles.c_center, styles.modal]}
                isOpen={isAdd?this.state.isAddModalOpen:this.state.isUpdateModalOpen} 
                onOpened={isAdd?this._openAddModal:this._openUpdateModal}
                onClosed={isAdd?this._closeAddModal:this._closeUpdateModal}
                backdrop={true} 
                backdropPressToClose={true}
                position={"center"} 
                ref={ref => {
                    isAdd
                    ?this._addModalRef = ref
                    :this._updateModalRef =ref
                }}>
            <Text style={{fontSize:18,fontWeight:'500', color:'#F29F3F', marginBottom:10}}>{isAdd?'新建生词本':'修改生词本'}</Text>
            <Input
                leftIcon={<AliIcon name='yingyong-beidanci-yingyongjianjie' size={26} color='#F29F3F'></AliIcon>}   
                placeholder='请输入生词本名称' 
                onChangeText={(name)=>{
                    isAdd
                    ?this.setState({addName:name})
                    :this.setState({updateName:name})
                }}/>
            <View style={styles.buttongGroup}>
                
                <Button type='clear' onPress={isAdd?this._closeAddModal:this._closeUpdateModal}
                title='取消'
                titleStyle={{fontSize:16, color:'#555'}}>
                </Button>
                <Button type='clear' onPress={isAdd?this._addVocaGroup:this._updateVocaGroup}
                title='确定'
                titleStyle={{fontSize:16, color:'#F29F3F'}}
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



    render() {

        return (
            <View style={styles.container}>
                <StatusBar translucent={true} />
                <Header
                statusBarProps={{ barStyle: 'light-content' }}
                barStyle="light-content" // or directly
                leftComponent={ 
                    <AliIcon name='fanhui' size={26} color='#303030' onPress={()=>{
                        this.props.navigation.goBack();
                    }}></AliIcon> }
                rightComponent={
                    <Text style={{color:'#303030', fontSize:16, fontWeight:'normal'}}>同步</Text>
                }
                centerComponent={{ text: '生词本', style: { color: '#303030', fontSize:18 } }}
                containerStyle={{
                    backgroundColor: '#FCFCFC',
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
                                        groupName:item.groupName
                                    });
                                        
                                }}>
                                    <View style={styles.groupItem}>
                                        <View style={[styles.row, {flex:1,}]}>
                                            <LinearGradient colors={['#FFE957', '#F29F3F',]} style={styles.iconBg}>
                                                <Text style={{color:'#FFF', fontSize:16, fontWeight:'500'}}>
                                                    {item.groupName[0]}
                                                </Text>
                                            </LinearGradient>
                                          
                                            <View>
                                                <Text numberOfLines={1} style={{fontSize:16, color:'#303030', marginLeft:10,}}>{item.groupName}</Text>
                                                <Text style={{fontSize:14, marginLeft:10}}>共{item.count}词</Text>
                                            </View>
                                        </View>
                                        {!this.state.inEdit &&  item.isDefault &&
                                            <AliIcon name='pingfen' size={26} color='#F29F3F'  style={{marginRight:10}}/>
                                        }
                                        {this.state.inEdit &&
                                            <View style={[styles.row, {flex:1}]}>
                                                <View style={[styles.row, {flex:1, justifyContent:'flex-end'}]}>
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
                    style={styles.footer}>
                        <View style={styles.bottomBtnGroup}>
                            <Button 
                            type="clear"
                            icon={ <Icon name="add"  size={16} color="#303030" />}
                            title='添加'
                            titleStyle={{fontSize:14,color:'#303030', fontWeight:'500'}}
                            onPress={this._openAddModal}>
                            </Button>
                            <View style={{width:1,height:20,backgroundColor:'#555'}}></View>
                            <Button 
                            type="clear"
                            icon={ <Icon name="edit"  size={16} color="#303030" />}
                            title={this.state.inEdit?'取消':'编辑'}
                            titleStyle={{fontSize:14,color:'#303030', fontWeight:'500'}}
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
