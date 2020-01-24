import VocaGroupDao from "../../vocabulary/service/VocaGroupDao"
import VocaTaskDao from "../../vocabulary/service/VocaTaskDao"


export const loginHandle = (data) => {
    console.log('---login handle---')
    const { credential, user } = data
    //token,user基本信息保存到redux
    const mineState = {
        credential: credential,
        user: {
            _id: user._id,
            phone: user.phone,
            nickname: user.nickname,
            avatarUrl: user.avatarUrl,
            sex: user.sex,
            level: user.level,
            role: user.role,
            wechat: user.wechat,
            qq: user.qq,
        },
        plan: user.plan,
    }

    // 保存vocaGroups
    if (user.vocaGroups && user.vocaGroups.length > 0) {
        const vgDao = VocaGroupDao.getInstance()
        vgDao.deleteAllGroups()
        vgDao.saveVocaGroups(user.vocaGroups)
    }

    // 保存vocaTasks
    if (user.plan && user.vocaTasks && user.vocaTasks.length > 0) {
        const vtDao = VocaTaskDao.getInstance()
        vtDao.deleteAllTasks()
        vtDao.saveVocaTasks(user.vocaTasks, user.plan.taskWordCount)
    }

    return mineState
}

export const logoutHandle = () => {

}