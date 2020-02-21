
var container = $('#container');
//匹配字符块
var SEPERATOR_REG = /([a-z]+[\-’]?[a-z]*)|([^a-z\-’\s]+)|(\s)/ig
//匹配单词
var WORD_REG = /[a-z]+[\-’]?[a-z]*/i

var MARGIN_R = 6                //单词间距
var CONTENT_PAD = 20            //文章显示内边距

var SelectedQuestionNode = null //选择的"点击答题" 节点
var SelectedQuestionNum = 0
var KeyWordNodes = []
var SearchedWordNode = null   //正被查询的单词节点


function includeKeyWord(keyWords, word) {
    for (var i in keyWords) {
        if ((keyWords[i] === word) || (keyWords[i] === word.toLowerCase())) {
            return true
        }
    }
    return false
}

//初始化页面
function initPage(text, keyWords, color, size) {
    //初始化背景色和字号
    $('html').css({ backgroundColor: color })
    $('html').css({ fontSize: size })

    //分割文本
    var contents = text.match(SEPERATOR_REG)
    // console.log(contents)
    //添加节点
    var node = null

    //先清空
    container.html(null)
    //开始添加
    contents.forEach(function (item, i, arr) {

        var obj = item.match(WORD_REG)

        if (obj) {                        //如果是单词
            node = $('<span>' + obj[0] + '</span>')
            node.on('click', searchWord)
            if (arr[i + 1] && arr[i + 1].match(/\s/)) {
                node.addClass('space')
            }
            //如果是关键词

            if (includeKeyWord(keyWords, obj[0])) {
                KeyWordNodes.push(node);
                node.addClass('keyWord')
            }
        } else {                          //如果是非单词
            if (item === '##') {
                node = $('<span>&nbsp&nbsp</span>')
            } else if (item === '##“') {
                node = $('<span>&nbsp&nbsp“</span>')
            } else if (item === '##"') {
                node = $('<span>&nbsp&nbsp"</span>')
            } else if (item.match(/\d+点击答题/)) {        //【题型2】点击答题
                var questionNum = item.match(/\d+/)[0]
                numNode = $('<sapn>(' + questionNum + ')</sapn>')
                container.append(numNode)
                node = $('<sapn>点击答题</sapn>')
                    .addClass('space underline')
                node.on('click', selectQuestion)
                //样式初始化
                if (SelectedQuestionNode === null) {
                    SelectedQuestionNode = node
                    SelectedQuestionNum = questionNum
                    SelectedQuestionNode.addClass('selectedQuestion')
                }

            } else if (item.match(/\n/)) {  //换行
                node = $('<div></div>')
                node.css({ width: '100%', height: 20 })

            } else if (item.match(/\s/i)) {    //空格
                //do nothing
            } else {
                node = $('<span>' + item + '</span>')
                node.addClass('space')
            }
        }
        container.append(node)

        if (arr[i + 1]) {
            if (arr[i + 1].match('\n')) {//下一个是换行
                container.append('<div>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>')
            }
        }

    }); //结束添加

    container.append($('<div ></div>').css({ width: '100%', height: 200 }))

    //完成初始化
    setTimeout(function () {
        window.ReactNativeWebView.postMessage(JSON.stringify({ command: 'initFinish', payload: null }));
    }, 100)

}


/**
 *  获取同行的元素
 *  @param node 行最后一元素
 *  @param arr 同一行的元素数组(本身除外)
 */
function getSameRowNodes(node, arr) {
    var preNode = node.prev()
    if (preNode.offset().top === node.offset().top) {
        arr.push(preNode)
        //递归
        getSameRowNodes(preNode, arr)
    }
}
/**
 * 查询单词
 * @param {*} e 
 */
function searchWord(e) {
    if (SearchedWordNode !== null && SearchedWordNode.hasClass('searchedWord')) {
        SearchedWordNode.removeClass('searchedWord')
    }
    SearchedWordNode = $(e.target)
    console.log(SearchedWordNode.text())
    SearchedWordNode.addClass('searchedWord')
    // 发送给RN
    window.ReactNativeWebView.postMessage(
        JSON.stringify({ command: 'searchWord', payload: { word: SearchedWordNode.text() } })
    )
}
/**
 * 取消查询单词的样式
 * @param {*} e 
 */
function cancelSearchWord() {
    if (SearchedWordNode !== null && SearchedWordNode.hasClass('searchedWord')) {
        SearchedWordNode.removeClass('searchedWord')
    }
}



/**
 * 点击答题, 显示颜色
 * @param {*} e 
 */
function selectQuestion(e) {
    if (SelectedQuestionNode !== null && SelectedQuestionNode.hasClass('selectedQuestion')) {
        SelectedQuestionNode.removeClass('selectedQuestion')
    }
    SelectedQuestionNode = $(e.target)
    SelectedQuestionNode.addClass('selectedQuestion')
    var questionNum = SelectedQuestionNode.prev().text().replace(/\((\d+)\)/, '$1')
    console.log(questionNum)
    // 发送给RN
    window.ReactNativeWebView.postMessage(
        JSON.stringify({ command: 'selectBlank', payload: { blankNum: questionNum } })
    )
}
