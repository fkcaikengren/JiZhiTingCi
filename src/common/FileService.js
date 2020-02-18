
import RNFetchBlob from 'rn-fetch-blob'
import { Platform } from "react-native";
import { unzip } from 'react-native-zip-archive'
import { BASE_URL, VOCABULARY_DIR, FILE_ROOT_DIR } from './constant'
import { store } from "../redux/store";

const fs = RNFetchBlob.fs
const CacheDir = fs.dirs.CacheDir + '/'
const DocumentDir = fs.dirs.DocumentDir + '/'

export default class FileService {
    constructor() {
        console.disableYellowBox = true
    }

    //单例模式
    static getInstance() {
        if (!this.instance) {
            this.instance = new FileService();
        }

        return this.instance;
    }

    /*
        第一类：xml， => error		返回null
		第二类：json和txt 			json则解析，
		第三类：图片 gif,jpg,png	{uri:xxx} //根据平台判断
		第四类：音频 mp3,wav 		返回地址

		如果本地没有，网络请求失败，返回null.
     */

    fetch = async (url, path) => {
        console.log('--下载文件--' + url)
        try {
            const res = await RNFetchBlob.config({
                fileCache: true,
                path: path
            }).fetch('GET', url, {
                //headers..
            })
            if (res.respInfo.status === 200) {
                return res
            } else {
                await fs.unlink(path)
                console.log('--not found and remove file--')
                return null
            }
        } catch (err) {
            console.log("fetch 出错")
            console.log(err)
            return null
        }
    }

    /**
     *  加载文件,主要针对Voca资源操作
     * @param primaryDir 一级目录
     * @param filePath  文件路径
     * @returns 
     */
    load = async (primaryDir, filePath) => {
        //处理格式
        if (filePath.startsWith('/')) {
            filePath = filePath.substr(1)
        }

        //制定二级目录 (分类、bookId、类型检测)
        let secondDir = ''
        switch (primaryDir) {
            case VOCABULARY_DIR:  //单词目录
                const { bookId } = store.getState().plan.plan
                secondDir = (bookId && bookId !== '') ? bookId + '/' : ''
                break
        }

        const url = BASE_URL + filePath
        const cachePath = CacheDir + primaryDir + filePath //不使用二级目录
        const downloadPath = DocumentDir + primaryDir + secondDir + filePath

        try {
            //1.是否存在
            let cacheExist = await fs.exists(cachePath)
            const downloadExist = await fs.exists(downloadPath)
            let exist = false
            let realPath = cachePath
            if (cacheExist) {
                exist = true
            } else if (downloadExist) {
                exist = true
                realPath = downloadPath
            }
            //2.分类型讨论
            if (filePath.match(/\.json$/)) {
                if (exist) {
                    //读取文件
                    const data = await fs.readFile(realPath)
                    return JSON.parse(data)
                } else {
                    //下载文件
                    const res = await this.fetch(url, realPath)
                    return res.json()
                }
            } else if (filePath.match(/\.txt$/)) {
                if (exist) {
                    return fs.readFile(realPath)
                } else {
                    const res = await this.fetch(url, realPath)
                    return fs.readFile(realPath)
                }
            } else if (filePath.match(/(\.jpg|\.png|\.gif|\.jpeg)$/)) {
                if (exist) {
                    return { uri: Platform.OS === 'android' ? 'file://' + realPath : '' + realPath }
                } else {
                    const res = await this.fetch(url, realPath)
                    return { uri: Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path() }
                }
            } else if (filePath.match(/(\.mp3|\.wav)$/)) {
                if (exist) {
                    return realPath
                } else {
                    const res = await this.fetch(url, realPath)
                    return res.path()
                }
            }

        } catch (e) {
            console.log('-----FileService load error: -------')
            console.log(e)
        }
        return null
    }


    /**
     *  下载文件
     * @param primaryDir
     * @param filePath
     * @param progressFunc
     * @param shouldUnzip
     * @returns {Promise<void>}
     */
    download = ({
        filePath,
        primaryDir, //存储主目录
        progressFunc = (received, total) => { },
        shouldUnzip = false,
        afterUnzip = null,
    }) => {

        //处理格式
        if (filePath.startsWith('/')) {
            filePath = filePath.substr(1)
        }

        let storeDir = ''
        //不同存储目录采用不同策略
        switch (primaryDir) {
            //文件根目录
            case FILE_ROOT_DIR:
                storeDir = DocumentDir
                break
            //单词目录
            case VOCABULARY_DIR:
                const { bookId } = store.getState().plan.plan
                const secondDir = (bookId && bookId !== '') ? bookId + '/' : ''
                storeDir = DocumentDir + primaryDir + secondDir
                break

        }

        const url = BASE_URL + filePath
        const storePath = storeDir + filePath
        console.log(url)
        const task = RNFetchBlob.config({
            path: storePath
        }).fetch('GET', url, {
            //headers..
        })
        task.progress(progressFunc)
            .then(async _ => {
                //下载完成
                progressFunc(1, 1)
                //是否解压
                if (shouldUnzip) {
                    try {
                        const path = await unzip(storePath, storeDir)
                        // 删除压缩包
                        await fs.unlink(storePath)
                        console.log(`unzip completed at ${path}`)
                        if (afterUnzip)
                            afterUnzip()
                    } catch (e) {
                        console.log('下载后，解压失败')
                        console.log(e)
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        return task
    }




    /**
     * 查看目录大小
     * @param realPath
     * @returns {Promise<string|number>}
     */
    getSize = async (realPath) => {
        console.log('getSize path: ' + realPath)
        const exist = await fs.exists(realPath)
        if (exist) {
            this.size = 0
            await this._statisticsCacheSize(realPath)
            return (this.size / 1024 / 1024).toFixed(1)
        } else {
            return 0
        }
    }

    _statisticsCacheSize = async (path) => {
        const lstat = await fs.lstat(path)
        for (let stat of lstat) {
            if (stat.type === "directory") {
                await this._statisticsCacheSize(stat.path)
            } else {
                console.log(stat.path + ' : ' + stat.size)
                this.size += parseInt(stat.size)
            }
        }
    }

    /**
     * 清理缓存
     * @param path
     * @returns {Promise<string|number>}
     */
    clearCache = async (path = '') => {
        const realPath = CacheDir + path
        const size = await this.clear(realPath)
        return size
    }

    /**
     *  清理离线下载目录
     * @param path
     * @returns {Promise<string|number>}
     */
    clearDownload = async (path) => {
        const realPath = DocumentDir + path
        const size = await this.clear(realPath)
        return size
    }

    /**
     *  清理存储
     * @param realPath
     * @returns {Promise<string|number>}
     */
    clear = async (realPath) => {
        const exist = await fs.exists(realPath)
        if (exist) {
            await fs.unlink(realPath)
        }
        const size = await this.getSize(realPath)
        return size
    }

}