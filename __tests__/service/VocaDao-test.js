import 'react-native'
import VocaDao from '../../src/features/vocabulary/service/VocaDao'

const vd = new VocaDao()
beforeEach(() => {
    //打开数据库
    return vd.open()
});
afterEach(()=>{
    return vd.close()
})

it('单词模糊查询', ()=>{
    expect(vd.isOpen()).toBeTruthy()
    vd.getWordDetail('mother')

})

it('查词（模糊查询匹配的前8个单词）', ()=>{
    expect(vd.isOpen()).toBeTruthy()
    let data = vd.searchWord('se')
    console.log(data)
    expect(data.length).toBeLessThanOrEqual(8)
})
