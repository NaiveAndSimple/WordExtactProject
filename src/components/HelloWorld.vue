<template>
  <div>
    <h1></h1>
    <h5></h5>
    <el-row :gutter="10">
    <!--<el-col :span="6" :offset="1"><el-button type="primary" icon="el-icon-search" v-on:click ="getPassageID">点击获得文章ID</el-button></el-col>-->
    <el-col :span="6" :offset="6"><el-select v-on:change="getPassage" v-model="selected" placeholder="点击选择文章id" >
      <el-option v-for="pasid in passageCount"  v-bind:value="pasid.id" v-bind:key="pasid.id">
      </el-option>
    </el-select></el-col>
    <el-col :span="6"><span class="tipSpan">Selected passage id : {{ selected }}</span></el-col>
    <!--<el-col :span="5"><el-button type="primary" v-on:click ="getPassage">读取标注语篇</el-button></el-col>-->   
    </el-row>
    <p></p>
    <el-collapse-transition>
    <el-row :gutter="10">
      <el-col :span="12" :offset="6"><div class="wrap-pre"><pre v-html="passage"></pre></div></el-col>
    </el-row>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'created',
      passage:'',
      passageCount:[],
      selected:'',
    }
  },
  methods:{
    addUser : function(){
      var name = this.username;
      var age = this.age;
      this.$http.post('/api/user/addUser',{
        username:name,
        age:age
      },{}).then((response) =>{ //成功回调
        console.log(response);
      },response =>{ //错误回调
        console.log('出错了！')
      } )
    },

    getPassage : function(){
        console.log('getpassage func')
        this.$http.post('/api/user/getPassage',{id:this.selected}).then((response) =>{
          console.log(response.body[0].content)//已经是对象typeof
          //console.log(JSON.parse(response)) ;
          this.passage = response.body[0].content
        }, (response)=>{
          console.log('Error')
        })
      },

    getPassageID : function(){
      this.$http.get('api/user/getPassageID',{}).then(
        response =>{
          console.log(response.body[0].id)
          this.passageCount = response.body
          this.$message({
                        message: '已经获取到全部文章ID！请在右侧复选框选择文章ID进行查询',
                        type: 'success'
                    })
        },
        response =>{
          console.log('get ID error')
        }
      )
    },

  },
  mounted : function(){
    this.getPassageID();
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
pre{
    margin: 0 auto; 
    width: 90%;
    white-space: pre-wrap;
    font-size: 16px; 
    color: #909399;
    font-family: "微软雅黑"; 
    transition: all .4s ease-in-out;
    transition-property: all;
    transition-duration: 0.4s;
    transition-timing-function: ease-in-out;
    transition-delay: initial;       
}
.wrap-pre{
    position: relative;
    transition: all .5s ease-in-out;
    transition-property: all;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
    transition-delay: initial;    
    box-sizing: border-box;
    bottom: 0; 
    border: 1px solid #d8d8d8;
    border-radius: 6px;
    
}
.wrap-pre:hover{
    position: relative;
    box-shadow: 0 6px 18px 0 rgba(128, 131, 136, 0.5);
    bottom: 6px;
    
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
