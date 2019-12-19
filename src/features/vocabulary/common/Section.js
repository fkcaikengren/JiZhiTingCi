import VocaDao from '../service/VocaDao';

const uuidv4 = require('uuid/v4');
export default class Section{

  constructor(){
    this.sectionArr = []
  }

  // 判断是否有section
  getSection = (firstChar) =>{
    for(let s of this.sectionArr){
        if(s.section === firstChar){
            return s
        }
    }
    return null
  }

  // 添加单词
  pushWord = (word,isHidden)=>{
    let firstChar = word[0].toUpperCase()
    let ss = this.getSection(firstChar)
    if(ss === null){ 
      ss = {
        id: uuidv4(),
        section: firstChar,
        words: []
      }
      this.sectionArr.push(ss) 
    }
    // 查词
    const wordInfo = VocaDao.getInstance().lookWordInfo(word)
    //添加单词
    ss.words.push({
      id: uuidv4(),
      word: word,
      isHidden: isHidden,
      enPhonetic:  wordInfo.en_phonetic,
      enPronUrl:  wordInfo.en_pron_url,
      amPhonetic:  wordInfo.am_phonetic,
      amPronUrl:  wordInfo.am_pron_url,
      trans:  wordInfo.trans
    })
  }


  getSections = ()=>{
    return this.sectionArr
  }
}