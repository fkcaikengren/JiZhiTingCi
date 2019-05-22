import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Text } from 'native-base';
import DetailCard from '../../component/DetailCard';




export default class DetailDictPage extends Component {
    
  render() {
    return (
      <Container>
        <Content padder>
          <DetailCard/>
        </Content>
      </Container>
    );
  }
}