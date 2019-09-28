
import 'react-native'
import {createHttp} from "../../src/common/http";

const myhttp = createHttp()

it('注册登录',async ()=>{
    const res = await myhttp.post('/user/signUp', {phone:'18007473366'})
    console.log(res.data)
    const res2 = await myhttp.post('/user/phoneLoginView', {phone:'18007473366',verifyCode:'123456'})
    console.log(res2.data.data.user)
})

