import 'react-native'
import VocaDao from '../../src/features/vocabulary/service/VocaDao'

describe('VocaDao realm 测试', ()=>{
    const vd = new VocaDao()
    beforeEach(() => {
        //打开数据库
        return vd.open()
    });
    test('单词模糊查询', ()=>{
        expect(vd.isOpen()).toBeTruthy()
        vd.getWordDetail('mother')
    })
})