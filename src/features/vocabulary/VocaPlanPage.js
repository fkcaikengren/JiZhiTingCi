import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux';
import CardView from 'react-native-cardview'
import { Header, Button } from 'react-native-elements'
import gstyles from "../../style";
import AliIcon from "../../component/AliIcon";





const styles = StyleSheet.create({
    img: {
        width: 100,
        height: 140,
    },
    wordCount: {
        fontSize: 14,
        color: '#444',
        marginTop: 5
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1962dd',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});


class VocaPlanPage extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();

                        }} />}

                    centerComponent={{ text: '学习计划', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        borderBottomColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                <View style={[gstyles.c_start, { width: '100%', marginTop: 60 }]} >
                    <CardView
                        cardElevation={5}
                        cardMaxElevation={5}
                        style={{ marginBottom: 20 }}
                    >
                        <Image source={{ uri: "https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/resources/vocabook/liuji.jpg" }} style={styles.img} />
                    </CardView>
                    <Text style={gstyles.lg_black_bold}>六级高频词汇</Text>
                    <Text style={[gstyles.md_black, { marginTop: 5 }]}>每日新学15词，复习75词</Text>
                    <Text style={styles.wordCount}>(共<Text style={[styles.wordCount, { color: '#F29F3F' }]}>2058</Text>个单词)</Text>

                    <Button
                        title="更换单词书"
                        titleStyle={gstyles.lg_black}
                        containerStyle={{ width: 200, height: 60, marginTop: 40 }}
                        buttonStyle={{
                            backgroundColor: gstyles.mainColor,
                            borderRadius: 50,
                        }}
                        onPress={() => {
                            this.props.navigation.navigate("VocaLibTab")
                        }}
                    />
                </View>
            </View>
        );
    }
}


const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(VocaPlanPage);