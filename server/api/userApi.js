var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
var async = require('async');

// 连接数据库
var conn = mysql.createConnection(models.mysql);
var initialword = ''//获得选中词语
var basicWord = ''//获得选中词语的原型
conn.connect();
var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

// 增加用户接口
router.post('/addUser', (req, res) => {
    var sql = $sql.user.add;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.username, params.age], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

router.post('/getPassage',(req,res)=>{
    var sql = $sql.dict.getPassage;
    var id = req.body.id;
    conn.query(sql,[id],function(err,result){
        if (err){
            console.log(err)
        }
        if(result){
            console.log(result[0].content)
            jsonWrite(res,result)
        }
    })
});

router.get('/getPassageID',(req,res)=>{
    var sql = $sql.dict.getPassageID;
    conn.query(sql,[],function(err,result){
        if (err){
            console.log(err)
        }
        if(result){
            console.log(result)
            jsonWrite(res,result)
        }
    })
})

router.post('/getExplanation',(req,res)=>{
    var sql = $sql.dict.ifexist;
    var sql2 = $sql.dict.getexpl;
    var params = req.body;
    var content = params.content;
    initialword = content;
    var wordlist = content.split(' ');
    let originalwords = '';
    //wordlist.forEach(function(word){
        async.map(wordlist,function(word,callback){
            conn.query(sql,[word], function(err,result){//去数据库中查询lemma 然后在查询words
                console.log('f '+ word)
                if (err) {
                    console.log(err);
                }
                if (result) {
                    if(result.length === 0){
                        console.log('0: '+ result.length)//lemma数据库中无该词条 需要自己添加
                        //console.log('originalwordslist2:'+ originalwordslist)
                        callback(null,word)
                    }else{
                        console.log('not 0: '+ result[0].original)
                        //jsonWrite(res, result[0].original);
                        original = result[0].original;
                        //originalwordslist.push(original);
                        //console.log('originalwordslist:'+ originalwordslist)
                        callback(null,original)
                    }                        
                }                      
            })
        },function(err,results){
            console.log('result---------------');
            console.log(results);
            originalwords = results.join(' ')
            basicWord = originalwords
            conn.query(sql2,[originalwords],function(err,result){
                console.log(result)
                jsonWrite(res,result)
            })
            //jsonWrite(res,originalwords)
            //数据能够返回前端，接下来处理数据库
        })
       
})

router.post('/changeExpl',(req,res)=>{//改为直接增加词条释义
    var sql = $sql.dict.updateExpl
    console.log('后台changeExpl')
    newexpl = req.body.expl
    conn.query(sql,[newexpl.expl,newexpl.id],function(err,result){
        if(result){
            console.log('done')
            jsonWrite(res,result)
        }
        if(err){
            console.log(err)
        }
    })
})

router.post('/deleteExpl',(req,res)=>{
    content = req.body.expl
    console.log('删除词条' + content.expl+' id 是 '+ content.id)
    var sql = $sql.dict.deleteExpl
    conn.query(sql,[content.id],function(err,result){
        if(result){
            console.log('delete done!')
            jsonWrite(res,result)
        }
        if(err){
            console.log(err)
        }
    })
})

router.post('/addExpl',(req,res)=>{
    newexpl = req.body.newexpl
    console.log('增加词条'+newexpl)
    var sql = $sql.dict.addExpl
    var nowtime = new Date().toLocaleString()
    conn.query(sql,[newexpl.expl,nowtime,basicWord,newexpl.exampleSentence],function(err,result){
        if(result){
            console.log('插入成功')
            jsonWrite(res,result)
        }
        if(err){
            console.log('插入失败，错误信息 ' + err)
        }
    })
})

router.post('/addExpl2',(req,res)=>{
    var newexpl = req.body.newexpl
    console.log('newexpl')
    console.log(newexpl)
    console.log('创建词条：'+ basicWord + ",并添加释义："+ newexpl.expl)
    var nowtime = new Date().toLocaleString()
    var sql = $sql.dict.addword
    var sql2 = $sql.dict.addExpl
    conn.query(sql,[initialword,basicWord,nowtime],function(err,result){
        if(result){
            console.log('创建词条成功')
            conn.query(sql2,[newexpl.expl,nowtime,basicWord,newexpl.exampleSentence],function(err,result){
                if(result){
                    console.log('新词条释义添加成功')
                    jsonWrite(res,result)
                }
                if(err){
                    console.log(err)
                }
            })
        }
        if(err){
            console.log(err)
        }
    })
})

router.post('/saveTag',(req,res)=>{
    console.log(req.body.content)
    var sql = $sql.dict.savePassage
    conn.query(sql,[req.body.content],function(err,result){
        if(result){
            console.log('Saved')
            jsonWrite(res,result)
        }
        if(err){
            console.log(err)
        }
    })
})
//})

module.exports = router;