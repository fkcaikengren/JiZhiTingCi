
 var container = $('#container')
 var RightAnswers = null
 var AnswerArticle = null

 function initPage(analysisText, rightAnswers,answerArticle ){
    RightAnswers = rightAnswers
    AnswerArticle = answerArticle
     // 分段
    var paragraphNode = $('#analysis')
    analysisText.split('##').forEach(function(item, i, arr){
        if(item !== ''){
            paragraphNode.append(('<p>'+item+'</p>'))
        }
    })
 }


 function toggleRightAnswers(){
    if(RightAnswers){
        var answerArticleNode = $('#answerArticle') 
        if(answerArticleNode.has('p').length > 0){ //如果含有<p>标签
            // 移除
            answerArticleNode.html(null)
        }else{
            //显示答案文本
            AnswerArticle.split('##').forEach(function(item, i, arr){
                if(item !== ''){
                    //替换答案
                    item = item.replace(/(\d+)点击答题/g, function(s,index,ss){ //s表示匹配的字符串
                        var questionNum = s.match(/\d+/)[0]
                        console.log(questionNum)
                        var word = RightAnswers[questionNum]
                        return '('+questionNum+')<span class="answer">'+ word +'</span>'
                    })
                    console.log(item)
                    answerArticleNode.append($('<p></p>').html(item))
                
                }
            })
        }
    
    }

 }