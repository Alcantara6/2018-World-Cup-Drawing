<!-- 
    http://localhost:8080/teams/teamTable/id 
-->
<!-- 动态路由方法 VS data的响应-->
<!-- 动态路由Id VS v-for的index-->
<!-- 2.10: 使用props传递teamsPage获取到的球队数据，不再每次切换球队都向后台获取 -->
<!-- 包括beforeRouteUpdate -->
<template>
    <div id="teamTable">
        <header v-if="alert">{{ alert }}</header>
        <section class="serach">
            <div class="searchRow">
                <label for="name">姓名：</label> 
                <input type="text" placeholder="搜索球员名" v-model="searchName">
            </div>
            <div class="searchRow">
                <label for="role">场上位置：</label>
                <select id="role" required v-model="searchRole">
                    <option disabled value="">请选择</option>
                    <option value="前锋">前锋</option>
                    <option value="中场">中场</option>
                    <option value="后卫">后卫</option>
                    <option value="守门员">守门员</option>
                </select>
            </div>
            <div class="searchRow">
                <label for="club">俱乐部</label>
                <input id="club" type="text" placeholder="搜球员效力俱乐部" v-model="searchClub">
            </div>
        </section>
        
        <div class="table-team">
            <!-- 之前不想每个队做一个组件，所以v-for所有+v-if="currentId"
            用组件+动态路由方式，根据id获取数据，不用每个队做组件-->
            <h2>{{ this.currentTeam.teamName }}队关键球员</h2>
            <!-- title -->
            <ul class="table-title">
                <li>姓名</li>
                <li>号码</li>
                <li>位置</li>
                <li>年龄</li>
                <li>俱乐部</li>
                <li></li>
            </ul>
            <!-- 每个球员版块-->
            <ul class="table-player" v-for="(keyPlayer,index) in filterPlayers">
                <li>{{keyPlayer.name}}</li>
                <li>{{keyPlayer.number}}</li>
                <li>{{keyPlayer.role}}</li>
                <li>{{keyPlayer.age}}</li>
                <li>{{keyPlayer.club}}</li>
                <!-- 跳转到具体某个球员的信息组件，由于新put的球员没有id,所以用index-->
                <router-link :to="'playerData/' + index" append>查看球员信息</router-link>
                <!-- 如果不用append, to的params只需要最后一个params -->
                <!-- 
                    <router-link tag="li" 
                        :to="{
                               name:'playerData',
                               params:{playId: keyPlayer.playId}
                            }">查看球员信息
                    </router-link></li> 
                -->
            </ul>
        </div>
        <div class="addPlayer">
            <!-- 跳转到查看球员页面 -->
            <router-link to="addPlayer" append>添加球员</router-link>
            <!-- <router-link :to="'/teams/teamTable/' + team.id + '/addPlayer'">添加球员</router-link> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'teamTable',
    props: {
        teams: {
            type: Array
        }
    },
    data() {
        return {
            currentTeam: this.teams[this.$route.params.id],
            alert: '',
            searchName: '',
            searchRole: '',
            searchClub: ''
        }
    },
    computed: {
        // 筛选球员,不输入或匹配正确则返回true；因为中文字符，不使用正则
        // XXX 首先要判断是否含有this.team.keyPlayers
        // 使用for循环不使用filter; 使用三元运算符
        // XXX &&逻辑操作符，有三个操作数，需要加括号！
        // XXX 用push()不用result[i]=keyPlayers[i],否则有undefined数组项
        // XXX 注意indexOf判断项的前后顺序
        filterPlayers() {
            if(Array.isArray(this.currentTeam.keyPlayers)) {
                let keyPlayers = this.currentTeam.keyPlayers;
                let result = [];
                for(let i = keyPlayers.length - 1; i>-1; i--) {
                    // 匹配姓名搜索
                    let nameFlag = this.searchName === ''
                    ?true
                    :(keyPlayers[i].name.indexOf(this.searchName) !== -1
                      ?true:false);
                    // 匹配俱乐部搜索
                    let roleFlag = this.searchRole === ''
                    ?true
                    :(keyPlayers[i].role.indexOf(this.searchRole) !== -1
                      ?true:false);
                    // 匹配俱乐部搜索
                    let clubFlag = this.searchClub === ''
                    ?true
                    :(keyPlayers[i].club.indexOf(this.searchClub) !== -1
                      ?true:false);
                    if(nameFlag && (roleFlag && clubFlag)) {
                        result.push(keyPlayers[i]);
                    }
                }
                return result;
            } 
        }
    },

    methods: {
       
    },

    mounted() {
        if(this.$route.query.alert) {
            this.alert = this.$route.query.alert;
        }
    },

    // 不能用watch，因为判断alert是刚进入该路由的时候
    // 不能用beforeRouteEnter,不能使用组件实例this
    // updated主要针对虚拟DOM重新渲染，所以alert放在created或mounted中
    updated() {

    },

    // 当有keep-alive时，只有在activated钩子中渲染。例如添加和编辑球员
    activated() {
    //     this.fetchTeam(this.$route.params.id);
    },
    
    // 更改球队时，获取数据
    // 对于一个带有动态参数的路径 /foo/:id，
    // 在 /foo/1 和 /foo/2 之间跳转的时候，用watch $route或导航守卫监测变化 
    beforeRouteUpdate(to,from,next) {
        this.currentTeam = this.teams[to.params.id];
        this.alert = '';
        next();
    },
    // 或者用watch
    // watch: {
    //     $route(to) {
    //         this.fetchTeam(to.params.id);
    //     }
    // },
    
    // 离开该页面后。注意必须使用next()
    beforeRouteLeave(to,from,next) {
        this.alert = '';
        next();
    }
}
</script>

<style>
.table-team {
    display: table;
    width: 600px;
    border: 1px solid #0041c2;
}
.table-team>h2 {
    display: table-caption;
    text-align: center;
}
.table-title,
.table-player {
    display: table-row;
}
.table-title>li,
.table-player>li {
    display: table-cell;
}
.table-title {
    background: #0041c2;
    color: #fff;
}
</style>





