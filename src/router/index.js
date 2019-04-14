import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import editPas from '@/components/editPas'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    { 
      path: '/foo', 
      name:'editPas',
      component: editPas 
    }
  ]
})
