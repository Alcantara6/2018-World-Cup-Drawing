import Vue from 'vue'
import Router from 'vue-router'

const teamsPage = () => import(/* webpackChunkName: 'player' */ '../components/teamsPage');
const drawPage = () => import(/* webpackChunkName: 'draw' */ '../components/drawPage');
const teamTable = () => import(/* webpackChunkName: 'player' */ '../components/player/teamTable');
const addPlayer = () => import(/* webpackChunkName: 'player' */ '../components/player/addPlayer');
const playerData = () => import(/* webpackChunkName: 'player' */ '../components/player/playerData');
const editPlayer = () => import(/* webpackChunkName: 'player' */ '../components/player/editPlayer');

Vue.use(Router)
const router = new Router({
	mode: 'history',  // 生产环境需要后台配置支持
	base: __dirname,
	scrollBehavior(to, from, savedPosition) {
		console.log(savedPosition);
        return savedPosition?savedPosition:{x: 0, y: 0}
	},
	routes: [
		{
            path: '/',
            component: teamsPage,
            redirect: {name: 'teamTable', params: {id: '0'}}  // 重定向
		},
		{
			path: '/teams',
			component: teamsPage,
            redirect: '/teams/teamTable/0',  // 重定向
			children: [
				// {
				//     path: '',
				//     component: {template: '<h1>查询不到数据</h1>'}   // 优先于重定向
				// },
				{
					name: 'teamTable',
					path: 'teamTable/:id',
			        component: teamTable,
			        props: (route) => ({teamId: route.params.id})    // 动态路径参数
				},
				{
					path: 'teamTable/:id/addPlayer',
					component: addPlayer,
					meta: {title: '添加球员'}
				},
				{
					name: 'playerData',
					path: 'teamTable/:id/playerData/:playerId',
					component: playerData,
					meta: {title: '球员信息'}
				},
				{
					name: 'editPlayer',
					path: 'teamTable/:id/playerData/:playerId/edit',
					component: editPlayer,
					meta: {title: '编辑球员'}
				}
			]
		},
		{
			path: '/draw',
			component: drawPage
		},
		{
			path: '*',
			component: {
				template: `
				<div>
				    <h1>{{$route.params.pathMatch}}</h1>
				    <p style="fontSize: 50px">404 NOT FOUND</p>
			    </div>`
			}
		}
	]
})

router.beforeEach((to, from ,next) => {
    document.title = to.meta.title || '2018俄罗斯世界杯'
	next();
});

export default router;