import VocaGroupDao from "../../vocabulary/service/VocaGroupDao"
import VocaTaskDao from "../../vocabulary/service/VocaTaskDao"


export const loginHandle = (data)=>{
    console.log('---login handle---')
    const {token, user} = data
    //token,user基本信息保存到redux
    const userState = {
        token:token,
        user:{
            _id: user._id,
            phone: user.phone,
            nickname: user.nickname,
            avatarUrl: user.avatarUrl,
            gender: user.gender,
            level: user.level,
            role:user.role,
        }
    }

    //vocaGroups保存数据库
    if(user.vocaGroups && user.vocaGroups.length>0){
        const vgDao = VocaGroupDao.getInstance()
        vgDao.deleteAllGroups()
        vgDao.saveVocaGroups(user.vocaGroups)
    }

    //vocaTasks保存数据库
    if(user.plan && user.vocaTasks && user.vocaTasks.length>0){
        const vtDao = VocaTaskDao.getInstance()
        vtDao.deleteAllTasks()
        vtDao.saveVocaTasks(user.vocaTasks, user.plan.taskWordCount)
    }

    return userState
}

export const logoutHandle = ()=>{

}