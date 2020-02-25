import { store } from "../../../redux/store"
import { LOGOUT } from "../redux/action/mineAction"
import VocaTaskDao from "../../vocabulary/service/VocaTaskDao"
import VocaGroupDao from "../../vocabulary/service/VocaGroupDao"
import ArticleDao from "../../reading/service/ArticleDao"
import AnalyticsUtil from "../../../modules/AnalyticsUtil"

export const loginHandle = (data, navigation) => {
    const { credential, user, words, articles } = data
    const success = (data != null && user != null && credential.accessToken != null)

    /*极光统计:登录事件*/
    AnalyticsUtil.postEvent({
        type: 'login',
        method: "loginHandle",
        success
    })
    //统计注册事件
    if (user && (user.plan === null || user.plan.bookId == null)) {
        AnalyticsUtil.postEvent({
            type: 'register',
            method: "loginHandle",
            success
        })
    }
    if (!success) {
        return
    }

    //1.标记登录进入App首页
    console.log('---通过登录进入App首页--')
    IsLoginToHome = true

    //2.重新认证加载
    navigation.navigate("AuthLoading", {
        user,
        words,
        articles,
    })

    //3.返回数据（保存到redux）
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
        finishedBooksWordCount: user.statistic.finishedBooksWordCount,
        allLearnedCount: user.statistic.allLearnedCount,
        allLearnedDays: user.statistic.allLearnedDays
    }
    return mineState
}

export const logoutHandle = () => {

    //1.清空Storage 
    Storage.clearMapForKey('notSyncTasks')

    Storage.clearMapForKey('addedFinishDays')
    Storage.clearMapForKey('finishDays')
    Storage.remove({ key: 'finishedBooks' })

    Storage.clearMapForKey('notSyncGroups')
    Storage.remove({ key: 'groupOrdersString' })

    //2.清空token和user
    store.dispatch({ type: LOGOUT })
    //3.清空realm 
    VocaTaskDao.getInstance().deleteAll() //清空任务数据
    VocaGroupDao.getInstance().deleteAllGroups() //清空生词本数据
    ArticleDao.getInstance().deleteAllArticles()

    //跳转登录页面
    Navigate("LoginStack")
}