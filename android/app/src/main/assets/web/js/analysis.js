
 var container = $('#container')
 var RightAnswers = null
 var AnswerArticle = null

 function initPage(analysisText,showRightAnswers, rightAnswers,answerArticle,showUserAnswers, userAnswers ){
    RightAnswers = rightAnswers
    AnswerArticle = answerArticle
     // 显示解析
    var paragraphNode = $('#analysis')
    analysisText.split('##').forEach(function(item, i, arr){
        if(item !== ''){
            paragraphNode.append(('<p>'+item+'</p>'))
        }
    })

    //显示标准答案，调用toggleRightAnswers
    if(showRightAnswers){
        toggleRightAnswers()
    }

    //显示用户答案
    if(showUserAnswers){
        var rightAnswerNode = $('#answerArticle')
        var userAnswerNode = $('<div id="userAnswerCard"></div>')
        rightAnswerNode.before(userAnswerNode)
        userAnswerNode.append($('<div id="cardBar"><span>我的答题卡</span></div>'))
        //遍历用户答案
        var totalCount = 0
        var rightCount = 0
        for(var k in RightAnswers){
            totalCount++
            var wrapperNode = $('<sapn></sapn>').addClass('userAnswerWrapper')
            var numNode = $('<sapn>'+k+'</sapn>').addClass('userAnswerNum')
            var answerNode = $('<sapn>'+userAnswers[k]+'</sapn>')
            if(userAnswers[k]){
                if(userAnswers[k] === RightAnswers[k]){ //正确绿色显示
                    rightCount++
                    numNode.css({backgroundColor:'#01D867'})
                    answerNode.css({color:'#01D867'})
                }else{                                  //错误红色显示
                    numNode.css({backgroundColor:'#D43232'})
                    answerNode.css({color:'#D43232'})
                }
            }else{
                numNode.css({backgroundColor:'#F29F3F'})
                answerNode.css({color:'#F29F3F'})
                answerNode.text('未作答')
            }
            wrapperNode.append(numNode).append(answerNode)
            userAnswerNode.append(wrapperNode)
        }

        var acc =  ((rightCount/totalCount).toFixed(3)*100)+'%';
        //统计正确率
        $('#cardBar').append($('<span>正确率: '+acc.fontcolor("#01D867")+'</span>'))

    }
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