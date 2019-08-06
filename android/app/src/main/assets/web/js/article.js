
 //匹配字符块
var SEPERATOR_REG = /([a-z]+[\-’]?[a-z]*)|([^a-z\-’\s]+)|(\s)/ig
//匹配单词
var WORD_REG = /[a-z]+[\-’]?[a-z]*/i

var MARGIN_R = 6                //单词间距
var CONTENT_PAD = 20            //文章显示内边距
var EndNodes = []               //每段最后的节点
var SelectedQuestionNode = null //选择的"点击答题" 节点
var SelectedQuestionNum = 0
var KeyWords = ["Church", "towns", "hanger"]
var KeyWordNodes = []
var SearchedWordNode = null   //正被查询的单词节点

 //初始化页面
 function initPage(text){
    var container = $('#container');
    //分割文本
    var contents  = text.match(SEPERATOR_REG)
    // console.log(contents)
    //添加节点
    var node = null
    
    //先清空
    container.html(null)
    //开始添加
    contents.forEach(function (item, i, arr){
      
        var obj = item.match(WORD_REG)
       
        if(obj){                        //如果是单词
            node = $('<span>'+obj[0]+'</span>')
            node.on('click', searchWord)
            if(arr[i+1] && arr[i+1].match(/\s/)){
                node.addClass('space')
            }
            //如果是关键词
            if(KeyWords.indexOf(obj[0]) !== -1){
                KeyWordNodes.push(node);
                node.addClass('keyWord')
            }
        }else{                          //如果是非单词
            if(item === '##'){
                node = $('<span>&nbsp&nbsp</span>')
            }else if(item.match(/\d+点击答题/)){        //【题型2】点击答题
                var questionNum = item.match(/\d+/)[0]
                numNode = $('<sapn>('+questionNum+')</sapn>')
                container.append(numNode)
                node = $('<sapn>点击答题</sapn>')
                .addClass('space underline')
                node.on('click', selectQuestion)
                //样式初始化
                if(SelectedQuestionNode === null){
                    SelectedQuestionNode = node
                    SelectedQuestionNum = questionNum
                    SelectedQuestionNode.addClass('selectedQuestion')
                }

            }else if(item.match(/\n/)){  //换行
                node = $('<div></div>')
                node.css({width:'100%', height:20})

            }else if(item.match(/\s/i)){    //空格
                //do nothing
            }else{
                node = $('<span>'+item+'</span>')
                node.addClass('space')
            }
        }
        container.append(node)

        if(arr[i+1] ){           
            
            if(arr[i+1].match('\n')){//下一个是换行
                EndNodes.push(node)
            }
        }

    }); //结束添加

    container.append($('<view ></view>').css({width:'100%', height:140}))
    setTimeout(function(){
        //遍历，调整最后一行的间距
        // console.log(EndNodes)
        EndNodes.forEach(function(item, i, arr){

            //同上一个节点比较
            var preLeft = item.prev().offset().left
            var itemLeft = item.offset().left
            var preTop = item.prev().offset().top
            var itemTop = item.offset().top
            if((preTop == itemTop) && (itemLeft - preLeft > 10)){
                //添加一个新的span
                var rowNodes = []
                rowNodes.push(item)
                getSameRowNodes(item,rowNodes)
                var widthSum = 0
                for(var i in rowNodes){
                    //宽度+外边距
                    widthSum += (rowNodes[i].offset().width + MARGIN_R)
                }
                //减去总宽度
                var nodeWidth = container.offset().width - CONTENT_PAD - widthSum
                console.log(nodeWidth)
                var nullNode = $('<sapn ></sapn>')
                nullNode.css({width:nodeWidth})
                item.after(nullNode)
            }

        })
        
    }, 100)
}


/**
 *  获取同行的元素
 *  @param node 行最后一元素
 *  @param arr 同一行的元素数组(本身除外)
 */
function getSameRowNodes(node, arr){
    var preNode = node.prev()
    if(preNode.offset().top === node.offset().top){
        arr.push(preNode)
        //递归
        getSameRowNodes(preNode,arr)
    }
}
/**
 * 查询单词
 * @param {*} e 
 */
function searchWord(e){
    if(SearchedWordNode !== null && SearchedWordNode.hasClass('searchedWord')){
        SearchedWordNode.removeClass('searchedWord')
    }
    SearchedWordNode = $(e.target)
    console.log(SearchedWordNode.text())
    SearchedWordNode.addClass('searchedWord')
    // 发送给RN
    window.ReactNativeWebView.postMessage(
        JSON.stringify({command:'searchWord', payload:{word:SearchedWordNode.text()}})
    ) 
}

/**
 * 点击答题, 显示颜色
 * @param {*} e 
 */
function selectQuestion(e){
    if(SelectedQuestionNode !== null && SelectedQuestionNode.hasClass('selectedQuestion')){
        SelectedQuestionNode.removeClass('selectedQuestion')
    }
    SelectedQuestionNode =  $(e.target)
    SelectedQuestionNode.addClass('selectedQuestion')
    var questionNum = SelectedQuestionNode.prev().text().replace(/\((\d+)\)/, '$1')
    console.log(questionNum)
    // 发送给RN
    window.ReactNativeWebView.postMessage(
        JSON.stringify({command:'selectQuestion', payload:{questionNum:questionNum}})
    ) 
}
