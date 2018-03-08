// XXX: props解耦传递动态路径参数：id和playerId
// 使用redirect重定向，进入/teams页面时，自动指向/teams/teamTable/0，即显示俄罗斯队球员列表

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
// Vue.component('player-data',{
//         name: 'keyPlayer',
//         template: `
//             <div>
// 	            <h2>关键球员数据</h2>
// 	            <p>点击球队查看和编辑各队关键球员</p>
// 	        </div>
//         `
//     }
// )

const router = new Router({
	mode: 'history',
	base: __dirname,
	routes: [
		{
            path: '/',
            component: teamsPage,
            redirect: '/teams/teamTable/0',  /*重定向*/
		},
		{
			path: '/teams',
			component: teamsPage,
			redirect: '/teams/teamTable/0',  /*重定向*/
			children: [
				{
					path: 'teamTable/:id',
			        component: teamTable,
			        props: (route) => ({teamId: route.params.id})
			        //teamTable可以不通过URL获取属性，而可以通过props获取
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