import React from 'react';
import { View , Text} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import OptionRadio from './component/OptionRadio'
import styles from './QuestionStyle'
import gstyles from '../../style'

const questions = [
  
  {
      no:"58",
      question:"In the Great Depression many unhappy couples close to stick together because",
      A:"starting a new family would be hard",
      B:"they  expected things would turn better",
      C:"they  wanted to better protect their kids",
      D:"living  separately would be too costly"
  },

];

export default class QuestionPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      activeSections: [],
    };
  }

  _renderSectionTitle = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  //手风琴的头部
  _renderHeader = q => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{q.no+'、'+'选择题'}</Text>
      </View>
    );
  };

  // 手风琴的内容
  _renderContent = q => {
    return (
      <View style={styles.content}>
        <Text style={styles.question}>{q.no+'. '+q.question}</Text>
        <OptionRadio 
          options= {[{ identifier:'A', content:"starting a new family would be hard"},{
            identifier:'B',content:"they  expected things would turn better",
          }]}
          containerStyle={{height:100}}
        />
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <Accordion
        sections={questions}
        activeSections={this.state.activeSections}
        renderSectionTitle={this._renderSectionTitle}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
      />
    );
  }

}