import 'react-native'
import VocaGroupDao from '../../src/features/vocabulary/service/VocaGroupDao'

const vgd = new VocaGroupDao()
beforeEach(() => {
    //打开数据库
    return vgd.open()
});
afterEach(()=>{
    //关闭数据库
    return vgd.close()
})

it('添加生词本', ()=>{
    vgd.addGroup('Sunny')
})

it('添加重名的生词本', ()=>{
    vgd.addGroup('abc')
    console.log(vgd.getAllGroups().length)
    expect(vgd.addGroup('abc')).toBeFalsy()
    console.log(vgd.getAllGroups().length)
})

it('当没有生词本，查询所有生词本', ()=>{
    const data = vgd.getAllGroups()
    console.log(data.length) //输出： 0
    expect(data).not.toBeFalsy()
})

it('当有生词本，查询所有生词本', ()=>{
    const data = vgd.getAllGroups()
    console.log(data)
    expect(data).not.toBeFalsy()
})


it('查询具体一生词本',()=>{
    console.log(vgd.getGroup('默认生词本'))
})

it('修改生词本名', ()=>{
   expect( vgd.updateGroupName('Sunny1', 'Sunny')).toBeTruthy()
    console.log(vgd.getAllGroups())
})


it('设置为默认生词本', ()=>{
    //不存在生词本
    expect(vgd.updateToDefault('xxx')).toBeFalsy()
    //存在生词本
    expect(vgd.updateToDefault('Sunny')).toBeTruthy()
    console.log(vgd.getAllGroups())
})

it('默认生词本不存在时，添加生词', ()=>{
    let groupWord = {
        id: 'xx',
        word: 'love',
        isHidden: false,
        enPhonetic: '/love/',
        enPronUrl: '/en/yy',
        amPhonetic: '/love/',
        amPronUrl: '/am/xx',
        tran: '爱'
    }
    vgd.addWordToDefault(groupWord)
})

it('默认生词本存在时，添加生词', ()=>{
    let groupWord = {
        id: 'xx',
        word: 'file',
        // isHidden: false,
        enPhonetic: '/share/',
        enPronUrl: '/en/yy',
        amPhonetic: '/share/',
        amPronUrl: '/am/xx',
        tran: '分享'
    }
    expect(vgd.addWordToDefault(groupWord)).toBeTruthy()
})

it('默认生词本添加重复生词', ()=>{
    let groupWord = {
        id: 'xx',
        word: 'like',
        // isHidden: false,
        enPhonetic: '/love/',
        enPronUrl: '/en/yy',
        amPhonetic: '/love/',
        amPronUrl: '/am/xx',
        tran: '爱'
    }
    expect(vgd.addWordToDefault(groupWord)).toBeFalsy()
    // expect(vgd.addWordToDefault(groupWord)).toBeFalsy()
})

it('批量删除生词本下的单词', ()=>{
    //删除存在的单词
    // expect(vgd.deleteWords('Sunny', ['share','love'])).toBeTruthy()
    //删除不存在的单词
    expect(vgd.deleteWords('Sunny', ['share','love'])).toBeTruthy()
})

it('生词本下有生词时，删除生词本以及单词',()=>{
    //不管生词本存不存在，删除都返回true
    expect(vgd.deleteGroup('Sunny')).toBeTruthy()
})


it('生词本下没有生词时，删除生词本',()=>{
    //删除一个不存在的生词本，不会报错
    vgd.deleteGroup('Sunny')
    console.log(vgd.getAllGroups())
})

it('删除所有的生词本,清空数据库', ()=>{
    vgd.deleteAllGroups()
})