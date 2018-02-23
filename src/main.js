import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import App from './App'
import teamsPage from './components/teamsPage'
import drawPage from './components/drawPage'
import teamTable from './components/player/teamTable'
import addPlayer from './components/player/addPlayer'
import playerData from './components/player/playerData'
import editPlayer from './components/player/editPlayer'

Vue.use(Router)
Vue.prototype.$axios = axios

const router = new Router({
	mode: 'history',
	base: __dirname,
	routes: [
		{
			path: '/teams',
			component: teamsPage,
			// redirect: '/teams/teamTable/0', 不能更新渲染，导航守卫不能用在跳转路由上
			children: [
				{
					path: 'teamTable/:id',
			        component: teamTable,
			        props: true   
			        //路由组件传参,通过 props 解耦，除了teams可以引用，其它地方也可以用
				},
				{
					// path只是一个路径而已可任意设定
					// 嵌套路由主要针对children所对应层级组件
					// 的template中的router-view的渲染
					// 为了让addPlayer组件关联id，这里的path加了teamTable
					path: 'teamTable/:id/addPlayer',
					component: addPlayer
				},
				{
					name: 'playerData',
					path: 'teamTable/:id/playerData/:playerId',
					component: playerData
				},
				{
					name: 'editPlayer',
					path: 'teamTable/:id/playerData/:playerId/edit',
					component: editPlayer
				}
			]
		},
		{
			path: '/draw',
			component: drawPage
		}	
	]
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})