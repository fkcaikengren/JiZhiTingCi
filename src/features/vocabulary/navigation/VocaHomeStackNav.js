import { createStackNavigator } from 'react-navigation';


import HomePage from '../HomePage';
import VocaSearchPage from '../VocaSearchPage';
import VocaPlayPage from '../VocaPlayPage';
import VocaLibPage from '../VocaLibPage';
import VocaListPage from '../VocaListPage';
import VocaGroupPage from '../VocaGroupPage'
import StatisticsPage from '../StatisticsPage';
import LearnCardPage from '../LearnCardPage';
import VocaDetailPage from '../VocaDetailPage';
import TestEnTranPage from '../TestEnTranPage';
import TestSentencePage from '../TestSentencePage';
import GroupVocaPage from '../GroupVocaPage';



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
      VocaList:{
        screen:VocaListPage,
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
      }
    
    },
    {
      initialRouteName: 'Home',
      headerMode:'none',
    }
  );

  export default VocaHomeStackNav;