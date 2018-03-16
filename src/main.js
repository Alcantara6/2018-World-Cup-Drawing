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

import '../static/iconfont/iconfont.css'

Vue.use(Router)
Vue.prototype.$axios = axios

const router = new Router({
	mode: 'history',
	base: __dirname,
	routes: [
		{
            path: '/',
            component: teamsPage,
            redirect: '/teams/teamTable/0'  // 重定向
		},
		{
			path: '/teams',
			component: teamsPage,
			redirect: '/teams/teamTable/0',  // 重定向
			children: [
				{
					path: 'teamTable/:id',
			        component: teamTable,
			        props: (route) => ({teamId: route.params.id})    // 动态路径参数
				},
				{
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