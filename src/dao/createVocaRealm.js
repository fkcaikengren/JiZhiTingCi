const Realm = require('realm');

// 1. 单词信息表：WordInfo
const WordInfoSchema = {
  name: 'WordInfo',
  primaryKey: 'id',
  properties: {
    id: 'int',                //单词id
    word: 'string',           //单词
    separator_word: 'string?',  
    inflection_type: 'string?',            //类型 [原型，变形，衍生词] => [prototype, transform, derivation]
    inflections: 'string?',     //其他类型引用
    freq: 'int',              //词频

    property: 'string?',       //词性（v,n,adj...）
    en_phonetic: 'string?',
    en_pron_url: 'string?',
    am_phonetic: 'string?',
    am_pron_url: 'string?',    
    tran: 'string?',              //全面的中文翻译
    root_id: 'int?',               //词根id
  }
};



// 2. 释义表：WordDef
const WordDefSchema = {
  name: 'WordDef',
  primaryKey: 'id',
  properties: {
    id: 'int',                //英英释义id
    word_id: 'int',    //词性id
    def: 'string?',             //英英释义
    def_pron_url: 'string?',     //英英释义音频
    syn: 'string?',         //同义词
    phrase: 'string?',      //短语
    def_tran: 'string?',     //中文释义
  }
};

// 3. 例句表：WordSentence
const WordSentenceSchema = {
  name: 'WordSentence',
  primaryKey: 'id',
  properties: {
    id: 'int',                      //句子id
    def_id: 'int',                  //英英释义id
    sentence: 'string?',            //句子
    sentence_pron_url: 'string?',   //句子音频
    
  }
};


  //4 短语表：PhraseInfo
  const PhraseInfoSchema = {
    name: 'PhraseInfo',
    primaryKey: 'id',
    properties: {
      id: 'int',                      
      phrase: 'string?',                  
      word: 'string?',            
      word_id: 'string?',   //单词id拼接，例：1200,1201
      def: 'string?',       //短语释义
      tran: 'string?',      //短语翻译
      sentence: 'string?',  //短语例句
      sentence_tran: 'string?', //短语例句翻译
    }

  };

  //5. 词根表
  const WordRootSchema = {
    name: 'WordRoot',
    primaryKey: 'id',
    properties: {
      id: 'int',              //词根单词ID  
      word: 'string?',        //单词
      root: 'string?',        //词根解释
      memory: 'string?',      //记忆方式
      tran: 'string?',        //单词翻译
      relatives: 'string?'     //相关的单词词根id
    }
  }



export const openVocaRealm = (fn)=>{
  //打开数据库(第一次创建)
  // schema: [WordInfoSchema, WordDefSchema, WordSentenceSchema,PhraseInfoSchema, WordRootSchema]
  Realm.open({path: 'voca.realm'})
  .then(realm => {
    fn(realm);
    // realm.compact();
    // realm.close();
  })
  .catch(error => {
    console.log(error);
  });
}







