
 var container = $('#container')
 var RightAnswers = null
 var FormatAnswer = null
 var RightAnswerNode = false

 function initPage(analysisText,showRightAnswers, rightAnswers,formatAnswer,showUserAnswers, userAnswers,color,size ){
    RightAnswers = rightAnswers
    FormatAnswer = formatAnswer
    //初始化背景色和字号
    $('html').css({backgroundColor:color})
    $('html').css({fontSize:size})

     // 显示解析
    var paragraphNode = $('#analysis')
    analysisText.split('##').forEach(function(item, i, arr){
        if(item !== ''){
            paragraphNode.append(('<p>'+item+'</p>'))
        }
    })

    // 显示正确答案
    createRightAnswer()
    if(!showRightAnswers){
        toggleRightAnswers()
    }
    


    //显示用户答案
    if(showUserAnswers){
        var RightAnswerNode = $('#rightAnswer')
        var userAnswerNode = $('<div class="answerCard"></div>')
        RightAnswerNode.before(userAnswerNode)
        var cardBarNode = $('<div class="cardBar"></div>')
        userAnswerNode.append(cardBarNode.append($('<span>我的答题卡</span>')))
        //遍历用户答案
        var totalCount = 0
        var rightCount = 0
        for(var k in RightAnswers){
            totalCount++
            var wrapperNode = $('<sapn></sapn>').addClass('answerWrapper')
            var numNode = $('<sapn>'+k+'</sapn>').addClass('answerNum')
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
        cardBarNode.append($('<span>正确率: '+acc.fontcolor("#01D867")+'</span>'))

    }
 }


 function createRightAnswer(){
    if(RightAnswers){
        RightAnswerNode = $('#rightAnswer') 
         //显示答案文本
         if(FormatAnswer.hasArticle){
            FormatAnswer.content.split('##').forEach(function(item, i, arr){
                if(item !== ''){
                    //替换答案
                    item = item.replace(/(\d+)点击答题/g, function(s,index,ss){ //s表示匹配的字符串
                        var questionNum = s.match(/\d+/)[0]
                        console.log(questionNum)
                        var word = RightAnswers[questionNum]
                        return '('+questionNum+')<span class="answer">'+ word +'</span>'
                    })
                    console.log(item)
                    RightAnswerNode.append($('<p></p>').html(item))
                
                }
            })
        }else{ //没有文本，直接显示正确答案
            var answerCardNode = $('<div class="answerCard"></div>')
            var cardBarNode = $('<div class="cardBar"></div>')
            answerCardNode.append(cardBarNode.append($('<span>正确答案</span>')))

            var content = FormatAnswer.content
            for(var k in content){
                var wrapperNode = $('<sapn></sapn>').addClass('answerWrapper')
                var numNode = $('<sapn>'+k+'</sapn>').addClass('answerNum')
                var answerNode = $('<sapn>'+content[k]+'</sapn>')
                numNode.css({backgroundColor:'#01D867'})
                answerNode.css({color:'#01D867'})
                wrapperNode.append(numNode).append(answerNode)
                answerCardNode.append(wrapperNode)
            }

            RightAnswerNode.append(answerCardNode)
        } 
        RightAnswerNode.css('display','block')
    }
 }

 //控制正确答案的显示和隐藏
 function toggleRightAnswers(){
    if(RightAnswerNode.css('display') === 'none'){
        RightAnswerNode.css('display','block')
    }else{
        RightAnswerNode.css('display','none')
    }
 }