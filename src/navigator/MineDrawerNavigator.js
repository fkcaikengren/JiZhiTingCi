import React, {Component} from 'react';
import {Platform, StatusBar, ScrollView, StyleSheet, View, Image} from 'react-native';
import {createDrawerNavigator, createAppContainer, DrawerItems, SafeAreaView } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import DownloadPage from '../page/DownloadPage';
import LearnedBookPage from '../page/LearnedBookPage';
import TimerPage from '../page/TimerPage';
import SettingPage from '../page/SettingPage';
import AliIcon from '../component/AliIcon';
import {turnLogoImg} from '../image';

const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');


const styles = StyleSheet.create({
    container:{
        flexGrow:1,
    }
});


class MineDrawerNavigator extends React.Component {
    constructor(props){
        super(props);
    }

    _genDrawerNav = ()=>{
        let drawers = {};
        console.log();

        
        drawers['download'] = {
            screen:DownloadPage,
            navigationOptions:{
                drawerLabel: '我的下载',
                drawerIcon: ({focused, tintColor})=>{
                    return <AliIcon name='xiazai' size={24} color='grey'></AliIcon>
                },
                drawerLockMode:'locked-closed'
            }
        };
        drawers['learnedBook'] = {
            screen:LearnedBookPage,
            navigationOptions:{
                drawerLabel: '已学单词书',
                drawerIcon: ({focused, tintColor})=>{
                    return <AliIcon name='yixue' size={24} color='grey'></AliIcon>
                },
                drawerLockMode:'locked-closed'
            }
        };
        drawers['timer'] = {
            screen:TimerPage,
            navigationOptions:{
                drawerLabel: '定时退出',
                drawerIcon: ({focused, tintColor})=>{
                    return <AliIcon name='dingshi' size={24} color='grey'></AliIcon>
                },
                drawerLockMode:'locked-closed'
            }
        };
        drawers['setting'] = {
            screen:SettingPage,
            navigationOptions:{
                drawerLabel: '设置',
                drawerIcon: ({focused, tintColor})=>{
                    return <AliIcon name='shezhi' size={24} color='grey'></AliIcon>
                },
                drawerLockMode:'locked-closed'
            }
        };
       

        return (createAppContainer(createDrawerNavigator(drawers,{
            
            drawerWidth: width*3/4,
            drawerPosition:'left',
            drawerType:'front',
            
            //抽屉内容
            contentComponent: (props) => (
                <ScrollView style={{backgroundColor: '#FFF', flex: 1}}>
                    <View style={{
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                    }}>
                        <Image source={turnLogoImg} style={{width:width*3/4, height:200}}></Image>
                    </View>
                    <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                        <DrawerItems {...props} />
                    </SafeAreaView>
                </ScrollView>
              ),
            //   抽屉内容样式
            contentOptions: {
                activeTintColor: '#FFF',
                activeBackgroundColor:'#FFF',
                labelStyle:{
                    fontSize:14,
                    color:'#101010'
                },
                iconContainerStyle: {
                    width:30,
                    height:30,
                    opacity: 1
                },
                itemsContainerStyle: {
                    
                },
            }
        })));
    }
    render(){
        let DrawerNav = this._genDrawerNav();
        return(
            <DrawerNav/>
        );
    }
}

export default MineDrawerNavigator;

