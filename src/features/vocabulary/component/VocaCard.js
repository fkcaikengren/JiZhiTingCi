import React, {Component} from 'react';
import {Platform, StatusBar,StyleSheet, ScrollView, View, Text} from 'react-native';
import {PropTypes} from 'prop-types';
import {Grid, Row, Col} from 'react-native-easy-grid'
import { Button } from 'react-native-elements';

import gstyles from '../../../style'
import AliIcon from '../../../component/AliIcon'
import ExampleCarousel from './ExampleCarousel'
import RootCard from './RootCard'

const styles = StyleSheet.create({
    contentContainer:{
        paddingVertical:16,
        backgroundColor:'#EFEFEF',
    },
    grid:{
        marginHorizontal:10,
        backgroundColor:'#EFEFEF',
    },
    basic:{
        backgroundColor:'#FFF',
        padding:10,
        borderRadius:5,
        marginBottom:16
    },
    carousel:{
        backgroundColor:'#FFF',
        borderRadius:5,
        marginBottom:16
    },
    root:{
        backgroundColor:'#FFF',
        borderRadius:5,
        marginBottom:16
    },
    errBtn:{
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:'#888',
        borderRadius:3,
        fontSize:12,
        color:'#888',
        paddingHorizontal:2,
        textAlign:'center',
        marginRight:10,
    },  
    darkFont:{
        color:'#303030',
        fontSize:16,
    },
    grayFont:{
        color:'#505050',
        fontSize:16,
    },
    marginTop:{
        marginTop:10,
    },
   
})

export default class VocaCard extends Component{

    constructor(props){
        super(props)
        this.state = {
            added:false
        }
        console.disableYellowBox=true

        console.log(this.props.wordInfo)
        this.wordRoot={
            word: 'abandon',        
            root: 'ban=prohibit,表示“禁止”',        
            memory: 'a 不+ban+don 给予=不禁止给出去=放弃 抛弃 放弃',      
            tran: 'v 抛弃,放弃',        
            relatives: '649,648'     
        }
        this.relativeRoots=[
            {
                word: 'banal',        
                root: 'ban=prohibit,表示“禁止”',        
                memory: 'ban+al=被禁止的=陈腐的 ',      
                tran: 'a 平庸的,陈腐的',        
                relatives: ''    
            },{
                word: 'banish',        
                root: '-ish 动词后缀',        
                memory: 'ban 禁止,放弃+ish',      
                tran: 'v 放逐,摒弃',        
                relatives: ''    
            },{
                word: 'banish',        
                root: '-ish 动词后缀',        
                memory: 'ban 禁止,放弃+ish',      
                tran: 'v 放逐,摒弃',        
                relatives: ''    
            },{
                word: 'banish',        
                root: '-ish 动词后缀',        
                memory: 'ban 禁止,放弃+ish',      
                tran: 'v 放逐,摒弃',        
                relatives: ''    
            }
        ]
        
    }
    _removeWord = ()=>{

    }
    _addWord = ()=>{

    }

    render(){
        const WordInfo = this.props.wordInfo
        return (
            
        <ScrollView style={{ flex: 1 }}
            pagingEnabled={false}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
        >
            <Grid style={styles.grid}>
                <Col>
                    {/* 单词基本信息 */}
                    <Col style={styles.basic}>
                        {/* 单词 */}
                        <Row style={gstyles.r_between}>
                            <Text style={{fontSize:20, fontWeight:'500', color:'#303030'}}>{WordInfo.word}</Text>
                            <View style={gstyles.r_end}>
                                <Text style={styles.errBtn}>报错</Text>
                                {this.state.added && //从生词本移除
                                    <AliIcon name='pingfen' size={22} color='#F29F3F' 
                                    style={{marginRight:10}} 
                                    onPress={this._removeWord}/>
                                }
                                {!this.state.added && //添加到生词本
                                    <AliIcon name='malingshuxiangmuicon-' size={22} color='#888' 
                                    style={{marginRight:10}} 
                                    onPress={this._addWord}/>
                                }
                                 <Button
                                    type="outline"
                                    title="词典"
                                    buttonStyle={{height:22,borderColor:'#F29F3F',borderWidth:StyleSheet.hairlineWidth}}
                                    titleStyle={{color:'#F29F3F', fontSize:12, lineHeight:22, paddingBottom:4}}
                                    icon={<AliIcon name='chazhao' size={12} color='#F29F3F' />}
                                />
                            </View>
                        </Row>
                        {/* 音标 */}
                        <Row style={[gstyles.r_start, ]}>
                            <Text style={styles.grayFont}>/əˈbændən/</Text>
                            <AliIcon name='shengyin' size={26} color='#F29F3F' style={{marginLeft:10}} />
                        </Row>
                        {/* 英英释义 */}
                        <Row style={[gstyles.c_center, styles.marginTop]}>
                            <Text style={styles.grayFont}>to leave someone, especially someone you are responsible for</Text>
                        </Row>
                        {/* 例句 */}
                        <Row style={[gstyles.r_start_top,styles.marginTop ]}>
                            <Text style={[styles.darkFont, {flex:10}]}>How could she abandon her own child?How cou she abandon her own child?</Text>
                            <AliIcon name='shengyin' size={26} color='#F29F3F' style={{flex:1,marginLeft:10}} />
                        </Row>
                        <Row style={styles.marginTop}>
                            <Col>
                                <Text style={styles.darkFont}>v.抛弃，遗弃〔某人〕</Text>
                                <Text style={styles.darkFont}>n.尽情; 放任</Text>
                            </Col>
                        </Row>
                        {/* 详细词典 */}
                    </Col>
                    {/* 场景例句 */}
                    <Col style={styles.carousel}>
                        <ExampleCarousel examples={WordInfo.examples}/>
                    </Col>
                    <Col style={styles.root}>
                        <RootCard wordRoot={this.wordRoot} relativeRoots={this.relativeRoots}/>
                    </Col>
                </Col>

            </Grid>
        </ScrollView>

        )
    }
}


VocaCard.propTypes = {
    wordInfo:PropTypes.object.isRequired
}
  
VocaCard.defaultProps = {

}