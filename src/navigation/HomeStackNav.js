import { createStackNavigator } from 'react-navigation';

import * as Constant from '../features/reading/common/constant'

import HomePage from '../features/vocabulary/HomePage';
import VocaSearchPage from '../features/vocabulary/VocaSearchPage';
import VocaPlayPage from '../features/vocabulary/VocaPlayPage';
import VocaLibPage from '../features/vocabulary/VocaLibPage';
import VocaListTabPage from '../features/vocabulary/VocaListTabPage';
import VocaGroupPage from '../features/vocabulary/VocaGroupPage'
import StatisticsPage from '../features/vocabulary/StatisticsPage';
import LearnCardPage from '../features/vocabulary/LearnCardPage';
import TestVocaTranPage from '../features/vocabulary/TestVocaTranPage';
import TestSentencePage from '../features/vocabulary/TestSentencePage';
import GroupVocaPage from '../features/vocabulary/GroupVocaPage';

//文章模块
import AnalysisPage from '../features/reading/AnalysisPage'
import ArticleTabPage from '../features/reading/ArticleTabPage'

// 单词模块
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
      },
      // 卡片学习
      LearnCard: {
        screen: LearnCardPage,
      },
     
      // 生词本的生词页
      GroupVoca: {
        screen: GroupVocaPage,
      },


      // 例句选词测试
      TestSentence: {
        screen: TestSentencePage,
      },
      // 单词选中义测试
      VocaTran: {
        screen: TestVocaTranPage,
      },
      // 中义选单词测试

      // 听音选中义测试


      
      //解析页面
      Analysis:{
        screen:AnalysisPage
      },
    
      //文章tab页
      ArticleTab:{
        screen:ArticleTabPage
      }

    },
    {
      initialRouteName: 'Home',
      headerMode:'none',
      initialRouteParams:{
      }
    }
  );

  export default VocaHomeStackNav;