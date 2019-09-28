import React from 'react';
import { View , Text} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import {connect} from 'react-redux';

import FileService from '../../common/FileService'
import OptionRadio from './component/OptionRadio'
import styles from './QuestionStyle'
import gstyles from '../../style'
import AliIcon from '../../component/AliIcon'
import * as ArticleAction from './redux/action/articleAction'


class QuestionPage extends React.Component {

  constructor(props){
    super(props)
    this.fileService = new FileService()
    
    this.state = {
      activeSections: [0],
      questionNo:"",  //修改
      questions:[]
    };

   
  }

  componentDidMount(){
    this._loadOption()
  }

  // 加载问题选项
  _loadOption = async ()=>{
    const {articleInfo} = this.props
    try{
      const questions = await this.fileService.loadText(articleInfo.optionUrl, 'json')
  
      this.setState({questions, questionNo:questions[0].no})
    }catch(e){
      console.log(e)
    }
  }

  //手风琴的头部
  _renderHeader = q => {
    const expand = ( this.state.questionNo === q.no)
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{q.no+'、'+'选择题'}</Text>
        <AliIcon name={expand?'youjiantou-copy':'youjiantou'} size={24} color='#303030' style={{marginRight:16}}/>
      </View>
    );
  };

  // 手风琴的内容
  _renderContent = q => {
    const options = []
    //对象转数组
    for(let k in q){
      if(k.length === 1){
        options.push({ 
          identifier:k, 
          content:q[k]
        })
      }
    }
    return (
      <View style={styles.content}>
        <Text style={styles.question}>{q.no+'. '+q.question}</Text>
        <OptionRadio 
          options= {options}
          onChange={this._onChangeOption}
          bgColor={'#CCC'}
        />
      </View>
    );
  };


  _onChangeOption = (index, option)=>{
    const userAnswerMap = new Map(this.props.article.userAnswerMap)
    console.log(typeof userAnswerMap)
    userAnswerMap.set(this.state.questionNo, option.identifier)
    this.props.changeUserAnswerMap(userAnswerMap)

  }

  _updateSections = activeSections => {
    console.log(activeSections[0])
    this.setState({ activeSections, questionNo:activeSections[0]!==undefined?this.state.questions[activeSections[0]].no:"" }); //[0]
  };

  render() {
    const {bgThemes, themeIndex} = this.props.article
    return (
      <View style={{flex:1, backgroundColor:bgThemes[themeIndex]}}>
        <Accordion
          sections={this.state.questions}
          activeSections={this.state.activeSections}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
        />
      </View>
    );
  }

}



const mapStateToProps = state =>({
  article : state.article,
});

const mapDispatchToProps = {
  changeUserAnswerMap: ArticleAction.changeUserAnswerMap
};
export default connect(mapStateToProps, mapDispatchToProps)(QuestionPage);