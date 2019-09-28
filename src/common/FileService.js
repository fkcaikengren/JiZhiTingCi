


import RNFetchBlob from 'rn-fetch-blob'
const Dirs = RNFetchBlob.fs.dirs
const ARTICLE_ROOT = Dirs.DocumentDir + '/articles/'
const URL = 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/articles'


export default class FileService{
    constructor(){
    }

    loadText = async (filePath, type='txt')=>{
        console.log(filePath)
        const path = ARTICLE_ROOT+filePath
        try{
            // 读取文本
            const text = await RNFetchBlob.fs.readFile(path)
            if(type === 'json'){
                return JSON.parse(text)
            }else{
                return text
            }

        }catch(e){
            //如果文件不存在 （加载失败）
            console.log('下载文件')
            try{
                //后台下载
                await RNFetchBlob.config({
                    fileCache:true,
                    path : path
                })
                .fetch('GET', URL+filePath, {
                    // more headers  ..
                })
              
                //读取文章
                const text = await RNFetchBlob.fs.readFile(path) 
                if(text.startsWith('<?xml')){
                    //删除文件
                    RNFetchBlob.fs.unlink(path)
                    .then(()=>{
                        console.log('获取文件失败, 已删除错误文件')
                    })
                }else{
                    if(type === 'json'){
                        try{
                            return JSON.parse(text)
                        }catch(e){
                            console.log(e)
                            //删除文件
                            RNFetchBlob.fs.unlink(path)
                            .then(()=>{
                                console.log('解析json文件失败, 已删除错误文件')
                            })
                        }
                    }else{
                        return text
                    }
                }
                
                
            }catch(e){
                console.log(e)
                RNFetchBlob.fs.unlink(path)
                .then(()=>{
                    console.log('FileService加载文本失败, 已删除错误文件')
                })
            }
        }
        return null
        
    }


    loadAudio = async ()=>{

    }

    loadPicture = ()=>{

    }
}