


/**QQ业务 */
export default class QQService {
    constructor() {
        console.disableYellowBox = true
    }

    //单例模式
    static getInstance() {
        if (!this.instance) {
            this.instance = new QQService();
        }
        return this.instance;
    }

}