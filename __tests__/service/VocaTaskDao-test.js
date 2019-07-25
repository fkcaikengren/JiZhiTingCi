
import 'react-native'
import VocaTaskDao from "../../src/features/vocabulary/service/VocaTaskDao";

const vtd = new VocaTaskDao()
beforeEach(() => {
    return vtd.open()
});
afterEach(()=>{
    return vtd.close()
})


it('getTodayTasks ', ()=>{
    console.log(vtd.getTodayTasks())
})