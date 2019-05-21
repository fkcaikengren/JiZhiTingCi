import React, { Component } from "react";
import { StyleSheet,AsyncStorage  } from 'react-native'
import {
  Container,
  Content,
  Button,
  Item,
  Input,
  Icon,
  Form,
  Text
} from "native-base";

class LoginPage extends Component {

    _loginAsync = async () => {
        await AsyncStorage.setItem('userToken', 'Jacy');
        this.props.navigation.navigate('Main');
      };

    render() {
        return (
        <Container style={styles.container}>
            <Content>
            <Form>
                <Item >
                <Icon active name="person" />
                <Input placeholder="用户名" />
                </Item>
                <Item>
                <Icon active name="home" />
                <Input placeholder="密码" />
                </Item>
                
            </Form>
            <Button bordered style={{borderColor:'white', margin: 15, marginTop: 50 }} onPress={()=>{
                    this._loginAsync();
            }}>
                <Text style={{color:'white'}}>Success</Text>
            </Button>
            </Content>
        </Container>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#77A3F0"
  }
});

export default LoginPage;