const Realm = require('realm');

export default class DictDao {
    constructor() {
        this.realm = null
    }


    //单例模式
    static getInstance() {
        if (!this.instance) {
            this.instance = new DictDao();
        }
        return this.instance;
    }

    /** 打开数据库 */
    async open() {
        try {
            if (!this.realm) {
                this.realm = await Realm.open({ path: 'dict.realm' })
            }
        } catch (err) {
            console.log(err)
        }
        return this.realm;
    }
    /** 数据库是否打开的 */
    isOpen() {
        return (this.realm !== null)
    }
    /**关闭数据库 */
    close = () => {
        if (this.realm && !this.realm.isClosed) {
            this.realm.close()
            this.realm = null
        }
    }

    /**查询单词 */
    getHtmlByWord = (word) => {
        let infos = this.realm.objects('DictInfo').filtered('word = "' + word + '"');
        let html = '<div>not found </div>'
        if (infos[0]) {
            html = infos[0].content;
        }
        return html
    }
}
