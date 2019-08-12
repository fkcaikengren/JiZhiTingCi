
/**
 * web脚本
 */
export default class WebUtil {

    //文章页监听RN
    static ARTICLE_LISTEN_JAVASCRIPT = 
        `document.addEventListener('message', function (e) {
            //回显
            window.ReactNativeWebView.postMessage(JSON.stringify(e.data));
            //处理
            var data = JSON.parse(e.data)
            try{
                    
                if(data.command === 'initPage'){                    //加载页面
                    
                    initPage(data.payload.text, data.payload.keywords, data.payload.color, data.payload.size)
                    
                }else if(data.command === 'selectAnswer'){          //选择答案
                    // 当前问题节点
                    window.SelectedQuestionNode.text(data.payload.word)
                    window.SelectedQuestionNode.css({color:'#F29F3F'})
                }else if(data.command === 'toggleKeyWords'){        //显示隐藏关键词
    
                    var isShow =  !window.KeyWordNodes[0].hasClass('keyWord')
                    window.KeyWordNodes.forEach(function(node,i,arr){
                        if(isShow){
                            //显示
                            node.addClass('keyWord')
                        }else{
                            node.removeClass('keyWord')
                        }
                    })
                }else if(data.command === 'changeBgtheme'){          //改变背景色
                    $('html').css({backgroundColor:data.payload.color})
                }else if(data.command === 'changeFontSize'){          //改变字号
                    $('html').css({fontSize:data.payload.size})
                }
            }catch(err){
                window.ReactNativeWebView.postMessage(JSON.stringify({command:'error',payload:{errMsg:err.message}}));
            }
            
        },true);true;`;


    static ANALYSIS_LISTEN_JAVASCRIPT = 
        `document.addEventListener('message', function (e) {
            //回显
            window.ReactNativeWebView.postMessage(JSON.stringify(e.data));
            //处理
            var data = JSON.parse(e.data)
            try{
                    
                if(data.command === 'initPage'){                            //加载页面
                    initPage(data.payload.analysis, 
                        data.payload.showRightAnswers,
                        data.payload.rightAnswers, 
                        data.payload.formatAnswer,
                        data.payload.showUserAnswers,
                        data.payload.userAnswers,
                        data.payload.color, 
                        data.payload.size)
                    
                }else if(data.command === 'toggleRightAnswers'){           //显示隐藏答案
                    toggleRightAnswers()
                }
            }catch(err){
                window.ReactNativeWebView.postMessage(JSON.stringify({command:'error',payload:{errMsg:err.message}}));
            }
            
        },true);true;`





    
}

{
}
