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
import VocaDetailPage from '../features/vocabulary/VocaDetailPage';
import TestEnTranPage from '../features/vocabulary/TestEnTranPage';
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
      // 单词详情
      VocaDetail: {
        screen: VocaDetailPage,
      },
      // 生词本的生词页
      GroupVoca: {
        screen: GroupVocaPage,
      },
      // 英英释义选词测试
      TestEnTran: {
        screen: TestEnTranPage,
      },
      // 例句选词测试
      TestSentence: {
        screen: TestSentencePage,
      },


      
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
      initialRouteName: 'VocaGroup',
      headerMode:'none',
      initialRouteParams:{
        vocaLibName:'CET-4',
        articleCode:5,
        articleType:Constant.FOUR_SELECT_READ
      }
    }
  );

  export default VocaHomeStackNav;