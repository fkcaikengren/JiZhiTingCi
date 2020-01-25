

export const loginHandle = (data, navigation) => {
    //1.标记登录进入App首页
    console.log('---通过登录进入App首页--')
    IsLoginToHome = true


    //2.进入首页
    const { credential, user } = data
    navigation.navigate("Home", {
        loginUserInfo: user
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
    }
    return mineState
}

export const logoutHandle = () => {

}