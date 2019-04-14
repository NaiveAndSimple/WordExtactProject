<template>
  <div>
    <h1 class="tipH1">在以下文本框输入要编辑的文本</h1>    
    <!---<textarea ref="inputText" cols="30" rows="10"></textarea><br>-->
    <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="textarea">
    </el-input>
    <h5></h5>
    <!---<button v-on:click="Todiv">确认开始编辑</button>-->    
    <div ref="">
        <el-row type="flex" justify="end">
        <el-col :span="3" ><el-button type="primary" plain v-on:click='Todiv'>确认编辑该文本</el-button></el-col>
        <el-col :span="4" ><el-button type="primary" plain v-on:click ="saveTag">保存标注文本到数据库</el-button></el-col>
        </el-row>
        <!---<button ref="editButton" v-show="editButton" v-on:click="getSelectText($event)">对选中内容进行查询</button>-->
        <div class="line1">以下是编辑区域<i class="el-icon-edit"></i>（划选以下编辑区域进行编辑）</div>
        <div class="line2"></div>
        <el-col :span="12" :offset="6"><div class="wrap-pre"><pre ref="pasDiv" class='editDiv' v-on:mouseup="getSelectText($event)">{{textarea}}</pre></div></el-col>
    </div>
    
    <div ref="opr" id="opr" v-show="isShow" class="showOperate" >
        <el-row>
        <el-col :span="6"><el-button v-on:click="closeOpr" type="primary" icon="el-icon-close"></el-button></el-col>
        <el-col :span="12"><span  class="tipSpan">正在标注的词条：{{this.txt.toString().trim()}}</span></el-col>
        <el-col><div v-show="isShowOp">
            <ul>
                <li class="OpLi" v-for="expl in testExplanation" :key="expl.id">
                    <el-tag>释义{{expl.id}}</el-tag><el-input v-model="expl.expl"></el-input>
                    <el-tag>释义意群片段</el-tag><el-input type="textarea" :rows="3"  placeholder="无意群片段" v-model="expl.exampleSentence" :readonly="true"></el-input>
                    <el-button type="primary" plain v-on:click="addTag(expl)">标注该词条</el-button>
                    <!--<el-button type="primary" plain v-on:click="changeExpl(expl)">修改该词条</el-button>-->
                    <!---<el-button type="primary" plain v-on:click="deleteExpl(expl)">删除该词条</el-button>-->
                    <div class="line"></div>
                </li>
            </ul>
        </div>
        </el-col>
        </el-row>
        <!--<p>修改释义<input v-model="explanation"></p>-->
        <div style="margin-top:15px;" >
            <el-row>
                <el-col :span="10" :offset="2"><el-input v-model="addList.expl" placeholder="请输入新释义"></el-input></el-col>
                <el-col :span="3" :offset="1"><el-button type="primary" plain v-on:click ="addExpl" v-show="showaddexpl1" >确认增加</el-button></el-col>
                <el-col :span="3" :offset="1"><el-button type="primary" plain @click="addExpl2" v-show="showaddexpl2" >新增词条释义</el-button></el-col>
             </el-row>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'editPas',
    data(){
        return{
            passage:' ',
            explanation:'',//后期再改成数组
            addExplanation:'',
            isShow:false,
            isShowOp:false,
            showaddexpl1:false,
            showaddexpl2:false,
            editButton:true,
            txt:'',
            textarea:'',
            testExplanation:[],
            savePosition:'',
            wholePassage:'',//保存在pasDiv里面的内容，转换为字符格式
            exampleSentence:'',//保存添加释义时对应的例句
            addList:{
                expl:'',
                exampleSentence:''
            }//对象，保存词条与对应例句
        }
    },
    methods: {
        Todiv : function(){
            //this.passage = this.$refs.inputText.value;             
            this.passage = this.textarea;
            this.$refs.pasDiv.innerHTML = this.passage;
            this.$message('请开始编辑')
        },

        getSelectText : function(e){
            //this.txt = window.getSelection();
            this.txt = window.getSelection();
            console.log('起始位置')
            console.log(window.getSelection().anchorOffset);
            var beginPosition = Number(window.getSelection().anchorOffset);
            console.log('结束位置')
            console.log(window.getSelection().focusOffset);
            var endPosition = Number(window.getSelection().focusOffset);
            if(this.txt.toString().trim() === ''){
                return;
            }
//---------------------提取句子----------------------------------------------
            this.savePosition = this.txt.getRangeAt(0);
            //console.log(this.txt)
            this.wholePassage = this.$refs.pasDiv.innerHTML.toString();
            var extractLength = 70;
            if(beginPosition <= extractLength){
                this.addList.exampleSentence = this.wholePassage.substring(0,endPosition + extractLength);
                //this.exampleSentence = this.wholePassage.substring(0,endPosition + extractLength);
            }else if(this.wholePassage.length <= endPosition + extractLength){
                this.addList.exampleSentence = this.wholePassage.substring(beginPosition - extractLength,this.wholePassage.length);
                //this.exampleSentence = this.wholePassage.substring(beginPosition - extractLength,this.wholePassage.length);
            }else{
                this.addList.exampleSentence = this.wholePassage.substring(beginPosition-extractLength,endPosition+extractLength);
                //this.exampleSentence = this.wholePassage.substring(beginPosition-extractLength,endPosition+extractLength);
            }
            console.log('example sentence:')
            console.log(this.addList.exampleSentence)
            console.log(this.savePosition);
//-----------------------与后台交互-------------------------------------------            
            this.$http.post('api/user/getExplanation',{content:this.txt.toString().trim()},{}).then(
                (response) =>{
                    //console.log(response.body);//response.body[0].original
                    if(response.body[0] === undefined){
                        console.log('没有该词条的解释')
                        this.isShow = true;
                        this.isShowOp = false;
                        this.showaddexpl2 = true;
                        this.showaddexpl1 = false;
                        console.log('坐标: '+ e.pageX + ' ' + e.pageY);
                        if(e.pageX > window.innerWidth/3){
                            this.$refs.opr.style.left = '450px';// e.pageX +'px'
                            this.$refs.opr.style.top = e.pageY + 'px';
                        }else{
                            this.$refs.opr.style.left = e.pageX +'px';
                            this.$refs.opr.style.top = e.pageY + 'px';
                        }

                    }else{
                        this.testExplanation = response.body
                        //console.log(this.testExplanation)
                        this.explanation = response.body[0].expl;//要考虑无解释的情况
                        this.isShow = true;
                        this.isShowOp = true;
                        this.showaddexpl1 = true;
                        this.showaddexpl2 = false;
                        console.log('坐标: '+ e.pageX + ' ' + e.pageY);
                        if(e.pageX > window.innerWidth/1.5){
                            this.$refs.opr.style.left = window.innerWidth - e.pageX +'px';
                            this.$refs.opr.style.top = e.pageY + 'px';
                        }else{
                            this.$refs.opr.style.left = e.pageX +'px';
                            this.$refs.opr.style.top = e.pageY + 'px';
                        }
                    }                    
                },
                response =>{
                    console.log('editpas.vue出错了')
                }
            )
        },

        closeOpr : function(){
            this.isShow = false;
            this.txt = '';

        },
        addTag : function(expl){//将expl作为释义标注
            //this.passage = this.textarea;
            console.log(this.txt)
            var insertExpl = "'"+expl.expl+"'"
            var redSpan = document.createElement('span')
            redSpan.style.color="red"
            redSpan.setAttribute("onmouseover","alert("+insertExpl+")")
            this.savePosition.surroundContents(redSpan)
            console.log(this.$refs.pasDiv.innerHTML);
            this.$message({
                        message: '添加标注成功！',
                        type: 'success'
                    })
        },
        changeExpl : function(newexpl){
            console.log('changeprocess')
            //console.log(newexpl.id)
            this.$http.post('api/user/changeExpl',{expl:newexpl},{}).then(
                (response) => {
                    console.log('更新成功')
                    this.$message({
                        message: '更新成功！',
                        type: 'success'
                    })
                },
                response =>{
                    console.log('更新词条出错了')
                    this.$message.error("更新词条出错了")
                }
            )
        },
        deleteExpl : function(nowexpl){
            this.$http.post('api/user/deleteExpl',{expl:nowexpl},{}).then(
                response =>{
                    console.log('删除成功')
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                },
                response =>{
                    console.log('删除出错了')
                    this.$message.error("删除出错了")
                }
            )
        },
        addExpl : function(){
            this.$http.post('api/user/addExpl',{newexpl:this.addList},{}).then(
                response =>{
                    console.log('添加成功')
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addList = {expl:'',exampleSentence:''};//重置值为空
                },
                response =>{
                    console.log('添加失败')
                    this.$message.error("添加失败")
                }
            )
        },

        addExpl2 :function(){
            this.$http.post('api/user/addExpl2',{newexpl:this.addList},{}).then(
                response =>{
                    console.log('添加成功！')
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.addList = {expl:'',exampleSentence:''};//重置值为空
                },
                response =>{
                    console.log('添加失败')
                    this.$message.error("添加失败")
                }
            )
        },
        saveTag : function(){
            console.log('saving')
            this.$http.post('api/user/saveTag',{content:this.$refs.pasDiv.innerHTML},{}).then(
                response =>{
                    console.log('成功保存')
                    this.$message({
                        message: '成功保存标注文章',
                        type: 'success'
                    })
                },
                response =>{
                    console.log('保存出错了')
                    this.$message.error("保存出错了")
                }
            )
        }
        

    }
}
</script>

<style scoped>
.showOperate{
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px solid #409EFF;
    background-color:white;
    overflow: auto;
    height: 250px;
    border-radius:5px;
}
.specialTag{
    color: #FF0000;
    font-size: large;
}
.editDiv{ 
    width: 90%;
    white-space: pre-wrap;
    font-size: 16px; 
    font-family: "微软雅黑";      
}

#opr{
    width: 750px ;
    height: 400px;
}

.line{
    margin-bottom: 30px;
}
.line1{
    margin-top: 10px;
    margin-bottom: 10px
}
.line2{
    background-color: #409EFF;
    height: 1px;
    margin-bottom: 10px
}
.tipH1{
    font-family: "微软雅黑";
    color:#303133;
}
pre{
    margin: 0 auto; 
    width: 90%;
    white-space: pre-wrap;
    font-size: 16px;
    font-family: "微软雅黑";       
}
.wrap-pre{
    position: relative;
    transition: all .5s ease-in-out;
    transition-property: all;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
    transition-delay: initial;    
    box-sizing: border-box;
    
}
.wrap-pre:hover{
    position: relative;
    box-shadow: 0 6px 18px 0 rgba(128, 131, 136, 0.5);
    
}
pre:hover{
    color: #303133;
   
}
.tipSpan{
  font-size: 20px;
  color: #909399;
  font-family: "微软雅黑"; 
}
</style>

