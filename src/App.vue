<template>
  <div id="app">
    <el-menu default-active="2" class="el-menu-demo" mode="horizontal"  text-color="#303133"
  active-text-color="#409EFF" >
    <el-menu-item index="1"><router-link to="/foo">编辑文章界面</router-link></el-menu-item>
    <el-menu-item index="2"><router-link to="/">读取文章界面</router-link></el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}

</script>

<style>

a {
    text-decoration: none;
}
.router-link-active {
    text-decoration: none;
}

</style>
