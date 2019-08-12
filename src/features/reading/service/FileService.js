


import RNFetchBlob from 'rn-fetch-blob'
const Dirs = RNFetchBlob.fs.dirs
const ARTICLE_ROOT = Dirs.DocumentDir + '/reading/'
const URL = 'https://test1-1259360612.cos.ap-chengdu.myqcloud.com/'

export default class FileService{
    constructor(){

    }

    loadText = async (filename)=>{
        const path = ARTICLE_ROOT+filename
        try{
            // 读取文章
            let text = await RNFetchBlob.fs.readFile(path) 
            return text

        }catch(e){
            //如果文件不存在 （加载失败）
            console.log('下载文件')
            try{
                //后台下载
                await RNFetchBlob.config({
                    fileCache:true,
                    path : path
                })
                .fetch('GET', URL+filename, {
                    // more headers  ..
                })
              
                //读取文章
                let text = await RNFetchBlob.fs.readFile(path) 
                return text
            }catch(e){
                console.log('FileService: 文件加载失败')
                console.log(e)
            }
        }
        
    }
}