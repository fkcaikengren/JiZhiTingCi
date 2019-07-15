import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text, TouchableNativeFeedback, Alert} from 'react-native';
import { Container, Header, Content, Body, Item, Input,
    Button, Footer, FooterTab} from "native-base";
import Modal from 'react-native-modalbox';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AliIcon from '../../component/AliIcon';
import VocaGroupDao from './dao/VocaGroupDao'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    row:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    col:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    groupItem:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#F0F0F0',
        borderRadius:4,
        marginTop:16, 
        paddingVertical:10
    },
    iconText:{
        width:32,
        height:32, 
        backgroundColor:'#1890FF', 
        textAlign:'center', 
        lineHeight:32, 
        borderRadius:50,
    },
    iconBg:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#1890FF',
        width:40,
        height:40,
        borderRadius:100,
        marginLeft:10,
    },
    modal: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
      },

    modal2: {
        width:width-100,
        height: 230,
        backgroundColor: "#EFEFEF"
    },
    buttongGroup:{
        width:width-100,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        marginTop:10
    }

   
   
    
});

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
        this.dao = new VocaGroupDao();
    }

    componentDidMount(){
        //打开数据库
        this.dao.open()
        .then(()=>{
            let vocaGroups = this.dao.getAllGroups();
            console.log('all groups:')
            console.log(vocaGroups[0].groupName)
            console.log(vocaGroups[0].sections.section)
            if(vocaGroups.length == 0){
                this.dao.addGroup('0默认生词本')
                this.dao.updateToDefault('0默认生词本')
            }
            this.setState({vocaGroups})
        })
       
    }

    componentWillUnmount(){
        alert('vocaGroup out, close realm')
        this.dao.close()
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
        return <Modal style={[styles.modal, styles.modal2]}
                isOpen={isAdd?this.state.isAddModalOpen:this.state.isUpdateModalOpen} 
                backdrop={false}  
                position={"center"} 
                ref={ref => {
                    isAdd
                    ?this._addModalRef = ref
                    :this._updateModalRef =ref
                }}>
            <Text style={{fontSize:18,fontWeight:'500', color:'red', marginBottom:10}}>{isAdd?'新建生词本':'修改生词本'}</Text>
            <Item rounded style={{height:30}}>
                <Input  style={{fontSize:16}} autoFocus placeholder='请输入生词本名称' onChangeText={(name)=>{
                    isAdd
                    ?this.setState({addName:name})
                    :this.setState({updateName:name})
                }}/>
            </Item>
            <View style={styles.buttongGroup}>
                <Button transparent onPress={isAdd?this._closeAddModal:this._closeUpdateModal}>
                    <Text style={{fontSize:16, }}>取消</Text>
                </Button>
                <Button transparent onPress={isAdd?this._addVocaGroup:this._updateVocaGroup}>
                    <Text style={{fontSize:16, color:'#1890FF'}}>确定</Text>
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
            let gName = g.groupName.substring(1)
            if(gName === name){
                alert(gName);
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
            alert('名称不能为空，添加失败')
        }else if(isExist){
            alert('重名了，添加失败')
        }else{
            // addVocaGroup(0+this.state.addName);
            
            alert('添加成功:'+this.state.addName)
            this.dao.addGroup(0+this.state.addName)
            this.setState({addName:''});
            
        }
   }

   //修改生词本
   _updateVocaGroup = () =>{
        this._closeUpdateModal()
        let isExist = this._isNameExist(this.state.updateName);
        
         //添加生词本
        if(this.state.updateName === ''){
            alert('名称不能为空，修改失败')
        }else if(isExist){
            alert('重名了，修改失败')
        }else{
            this.dao.updateGroupName(this.state.selectedName, 0+this.state.updateName);
            this.setState({updateName:'',selectedName:''})
            alert('修改成功')
        }
   }

    //删除生词本
    _deleteVocaGroup = (deleteName) =>{
        this.dao.deleteGroup(deleteName)
        alert('删除成功');
        this.setState({refresh:!this.state.refresh})
    }



    render() {

        return (
            <Container>
                <StatusBar
                    translucent={true}
                    // hidden
                />

                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#1890FF'}}></View>
                {/* 头部 */}
                <Header translucent noLeft noShadow style={{backgroundColor:'#FDFDFD', elevation:0,}}>
                    <Button transparent style={{position:'absolute', left:10}}>
                        <AliIcon name='fanhui' size={26} color='#1890FF' onPress={()=>{
                            this.props.navigation.goBack();
                        }}></AliIcon>
                    </Button>
                    <Body style={{flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',}}>
                        <Text style={{fontSize:16, color:'#1890FF', fontWeight:'500'}}>生词本</Text>
                    </Body>
                    <Button transparent style={{position:'absolute', right:10}}>
                        <Text style={{color:'#1890FF', fontSize:16, fontWeight:'normal'}}>同步</Text>
                    </Button>
                </Header> 

                <Content padder style={{ backgroundColor:'#FDFDFD', }}>
                    
                    
                {this.state.vocaGroups.map((item, index)=>{
                    //判断是什么类型的生词本
                    let iconName = ''
                    if(item.groupName.startsWith('0')){  //自定义
                        iconName = 'zi'
                    }else if(item.groupName.startsWith('1')){    //阅读生词本
                        iconName = 'yuedu'
                    } 
                    let groupName = item.groupName.substring(1);
                    return (
                        <TouchableNativeFeedback disabled={this.state.inEdit} key={index} onPress={()=>{
                            //加载生词
                            this.props.navigation.navigate('GroupVoca',{
                                dao:this.dao, 
                                groupName:item.groupName
                            });
                                
                        }}>
                            <View style={styles.groupItem}>
                                <View style={[styles.row, {flex:1,}]}>
                                    <View style={styles.iconBg}>
                                        <AliIcon name={iconName} size={20} color='#FFF'></AliIcon>
                                    </View>
                                    <View>
                                        <Text numberOfLines={1} style={{fontSize:16, color:'#303030', marginLeft:10}}>{groupName}</Text>
                                        <Text style={{fontSize:14, marginLeft:10}}>共{item.count}词</Text>
                                    </View>
                                </View>
                                {!this.state.inEdit &&  item.isDefault &&
                                    <Ionicons name='ios-star' color={'#EE4'} size={30} />
                                }
                                {this.state.inEdit &&
                                    <View style={[styles.row, {flex:1}]}>
                                        <View style={[styles.row, {flex:1, justifyContent:'flex-end'}]}>
                                            {/* 设置为默认生词本 */}
                                            <Ionicons name='ios-star' color={item.isDefault?'#EE4':'#909090'} size={30} onPress={()=>{
                                                if(!item.isDefault){ //不是默认
                                                    alert('设置为默认的');
                                                    this.dao.updateToDefault(0+groupName)
                                                    this.setState({refresh:!this.state.refresh})
                                                }
                                                }}/>
                                            {/* 修改 */}
                                            <TouchableNativeFeedback onPress={()=>{
                                                this.setState({isUpdateModalOpen:true,selectedName:item.groupName})
                                            }}>
                                                <Text style={{fontSize:14, color:'#1890FF', marginRight:10}}>修改名称</Text>
                                            </TouchableNativeFeedback>
                                            {/* 删除 */}
                                            <TouchableNativeFeedback onPress={()=>{
                                                Alert.alert(
                                                    '删除生词本',
                                                    `是否删除${groupName}?`,
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
            </Content>

                <Footer >
                    <FooterTab style={{backgroundColor:'#FDFDFD'}} onPress={()=>{
                    }}>
                        <Button onPress={()=>{
                            this._openAddModal();
                        }}>
                            <Text style={{fontSize:14,color:'#1890FF', fontWeight:'500'}}>添加</Text>
                        </Button>
                        <Button onPress={this._toggleEdit}>
                            <Text style={{fontSize:14,color:'#1890FF', fontWeight:'500'}}>{this.state.inEdit?'退出编辑':'编辑'}</Text>
                        </Button>
                    </FooterTab>
                </Footer>
                
                {
                    this._createModal(true) //创建添加弹框
                }
                {
                    this._createModal(false) //创建修改弹框
                }
                        
            </Container>
        );
    }
}
