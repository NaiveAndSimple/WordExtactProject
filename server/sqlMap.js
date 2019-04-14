// sql语句
var sqlMap = {
    // 用户
    user: {
        add: 'insert into user(id, name, age) values (0, ?, ?)'
    },
    dict: {
        getPassage:'select content from test.savepassage where id = ?',
        ifexist:'select original from test.lemma where variant = ?',
        bakgetexpl:'select id,expl from test.explanation where wid = (select min(id) from test.words where basic = ?)',
        getexpl:'select id,expl,exampleSentence from test.explanation where wid = (select min(id) from test.words where basic = ?)',
        updateExpl:'update test.explanation set expl = ? where id = ?',
        savePassage:'insert into savePassage(content) values (?)',
        deleteExpl:'delete from test.explanation where id = ?',
        addExpl:'insert into test.explanation(expl,createtime,wid,exampleSentence) values(?,?,(select min(id) from test.words where basic = ?),?)',
        addword:'insert into test.words(initial,basic,createtime) values(?,?,?)',
        getPassageID:'select id from test.savepassage'    
    }
    
}

module.exports = sqlMap;