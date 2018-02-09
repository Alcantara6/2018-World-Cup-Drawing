import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import App from './App'
import teamsPage from './components/teamsPage'
import teamTable from './components/teamTable'
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
			children: [
				{
					path: 'teamTable/:id',
			        component: teamTable
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
		}	
	]
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})