import { createStackNavigator } from 'react-navigation';

import * as Constant from '../features/reading/common/constant'

import HomePage from '../features/vocabulary/HomePage';
import VocaSearchPage from '../features/vocabulary/VocaSearchPage';
import VocaPlayPage from '../features/vocabulary/VocaPlayPage';
import VocaLibPage from '../features/vocabulary/VocaLibPage';
import VocaListTabPage from '../features/vocabulary/VocaListTabPage';
import VocaGroupPage from '../features/vocabulary/VocaGroupPage'
import GroupVocaPage from '../features/vocabulary/GroupVocaPage';
import StatisticsPage from '../features/vocabulary/StatisticsPage';
import LearnCardPage from '../features/vocabulary/LearnCardPage';

import TestVocaTranPage from '../features/vocabulary/TestVocaTranPage';
import TestTranVocaPage from '../features/vocabulary/TestTranVocaPage'
import TestSenVocaPage from '../features/vocabulary/TestSenVocaPage';
import TestPronTranPage from '../features/vocabulary/TestPronTranPage'


//文章模块
import AnalysisPage from '../features/reading/AnalysisPage'
import ArticleTabPage from '../features/reading/ArticleTabPage'


//我的模块


const VocaHomeStackNav = createStackNavigator(
    {
      // 首页
      Home: {
        screen: HomePage,
      },
      // 查词页面
      VocaSearch: {
        screen: VocaSearchPage,
      },
      // 单词库
      VocaLib:{
        screen:VocaLibPage,
      },
      // 单词列表
      VocaListTab:{
        screen:VocaListTabPage,
      },
      // 生词本
      VocaGroup:{
        screen:VocaGroupPage,
      },
  
      // 学习统计
      Statistics:{
        screen:StatisticsPage,
      },
      // 单词轮播
      VocaPlay: {
        screen: VocaPlayPage,
        gesturesEnabled: true,
      },
      // 卡片学习
      LearnCard: {
        screen: LearnCardPage,
      },
     
      // 生词本的生词页
      GroupVoca: {
        screen: GroupVocaPage,
      },


      // 单词选中义测试
      TestVocaTran: {
        screen: TestVocaTranPage,
      },
      // 听音选中义测试
      TestPronTran: {
        screen: TestPronTranPage,
      },
      // 中义选单词测试
      TestTranVoca:{
        screen: TestTranVocaPage
      },
      // 例句选词测试
      TestSenVoca: {
        screen: TestSenVocaPage,
      },
        


      
      //解析页面
      Analysis:{
        screen:AnalysisPage
      },
      //文章tab页
      ArticleTab:{
        screen:ArticleTabPage
      },



    },
    {
      initialRouteName: 'Home',
      headerMode:'none',
      initialRouteParams:{
      }
    }
  );

  export default VocaHomeStackNav;