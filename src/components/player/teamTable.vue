<!-- 
    http://localhost:8080/teams/teamTable/:id 
-->
<!-- 动态路径参数 VS data的响应-->
<!-- 动态路由Id VS v-for的index-->
<!-- 2.10: 使用props传递teamsPage获取到的球队数据，不再每次切换球队都向后台获取 -->
<!-- 包括beforeRouteUpdate -->
<!-- 3.5 XXX: props解耦传递动态路径参数：id和playerId
3.6 解决了props异步传输导致的渲染出错问题。teams是从父组件异步传输的数据，是父组件的teamList通过ajax请求的，teams.currentTeam初始为undefiend。通过vue-devtools检查出问题所在，解决方法：HTML模板中使用v-if（另一种方法是给props设定默认值default） -->
<template>
    <div id="players-data">
        <aside class="search">
            <h2>搜索球员</h2>
                <div class="search-content">
                    <div class="searchRow">
                        <label for="name">姓名：</label> 
                        <input type="text" placeholder="搜索球员名" v-model="searchName">
                    </div>
                    <div class="searchRow">
                        <label for="role">场上位置：</label>
                        <select id="role" required v-model="searchRole">
                            <option disabled value="">请选择</option>
                            <option value="">不限</option>
                            <option value="前锋">前锋</option>
                            <option value="中场">中场</option>
                            <option value="后卫">后卫</option>
                            <option value="守门员">守门员</option>
                        </select>
                    </div>
                    <div class="searchRow">
                        <label for="club">俱乐部：</label>
                        <input id="club" type="text" placeholder="搜球员效力俱乐部" v-model="searchClub">
                    </div>
                </div>
        </aside>
        
        <section class="table-team">
            <!-- 之前不想每个队做一个组件，所以v-for所有+v-if="currentId" -->
            <!-- 用组件+动态路由方式，根据id获取数据，不用每个队做组件 -->
            <!-- teams.currentTeam从父组件异步传输，currentTeam初始为undefiend -->
            <h3 class="table-caption" v-if="currentTeam">
                <p>{{ currentTeam.teamName }}队关键球员</p>
                <!-- 跳转到查看球员页面 -->
                <router-link class="add-player playerBtn" to="addPlayer" append tag="button">      添加球员
                </router-link>
                <!-- <router-link :to="'/teams/teamTable/' + team.id + '/addPlayer'">添加球员</router-link> -->
            </h3>
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
            <!-- filterPlayers可能为空数组，v-if判断 -->
            <ul class="table-player" v-if="filterPlayers.length" v-for="keyPlayer in filterPlayers">
                <li>{{keyPlayer.name}}</li>
                <li>{{keyPlayer.number}}</li>
                <li>{{keyPlayer.role}}</li>
                <li>{{keyPlayer.age}}</li>
                <li>{{keyPlayer.club}}</li>
                <router-link :to="'playerData/' + keyPlayer.playerId" append tag="li">
                    <button class="playerBtn">查看球员信息</button>
                </router-link>
                <!-- 如果不用append, to的params只需要最后一个params -->
                <!-- 
                    <router-link tag="li" 
                        :to="{
                               name:'playerData',
                               params:{playerId: keyPlayer.playId}
                            }">查看球员信息
                    </router-link></li> 
                -->
            </ul>
        </section>

        <footer v-if="alert">{{ alert }}</footer>
    </div>
</template>

<script>
export default {
    name: 'team-data',
    props: {
        teams: Array,
        teamId: String,
        playerId: String
    },
    data() {
        return {
            // currentTeam: this.teams[this.$route.params.id],改用props：{teamId: route.params.id}
            alert: '',
            searchName: '',
            searchRole: '',
            searchClub: '', 
        }
    },
    computed: {
        // XXX；切换不同球队时要更换currentTeam，所以不要放在data中
        currentTeam() {
            return this.teams[this.teamId];
        },
        // 筛选球员,不输入或匹配正确则返回true；因为中文字符，不使用正则
        // 使用for循环不使用filter; 使用三元运算符
        // XXX &&逻辑操作符，有三个操作数，需要加括号！
        // XXX 用push()不用result[i]=keyPlayers[i],可能有undefined数组项
        // XXX 注意indexOf判断项的前后顺序
        filterPlayers() {
            // props：currentTeam异步传输，初始为undefiend
            // keyPlayer可能未定义
            // 因此需要判断
            if(this.currentTeam && Array.isArray(this.currentTeam.keyPlayers)) {
                let keyPlayers = this.currentTeam.keyPlayers;
                let result = [];
                for(let i = keyPlayers.length - 1; i>=0; i--) {
                    // 匹配姓名的搜索
                    let nameFlag = this.searchName === ''
                    ?true
                    :(keyPlayers[i].name.indexOf(this.searchName) !== -1
                      ?true:false);
                    // 匹配场上位置的搜索
                    let roleFlag = this.searchRole === ''
                    ?true
                    :(keyPlayers[i].role.indexOf(this.searchRole) !== -1
                      ?true:false);
                    // 匹配俱乐部的搜索
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

    mounted() {
        this.$nextTick(function () {
            // 如果不是复用组件，则每次跳转到路由也是执行了一次mounted，
            // 复用组件，例如动态参数的路径跳转，用beforeRouteUpdate
            // mounted中监控$route.query
            // 获取更新后的球员数据写在父组件teamsPage.vue中
            this.alert = this.$route.query.alert;
        });
    },
    // this.$route.query.alert不能用watch，因为判断alert是刚进入该路由的时候
    // this.$route.query.alert不能用beforeRouteEnter,不能使用组件实例thi
    // updated主要针对虚拟DOM重新渲染
    // 所以alert放在created或mounted中
    updated() {
    },

    // 当有keep-alive时，只有在activated钩子中渲染。例如添加和编辑球员
    activated() {
    // this.fetchTeam(this.$route.params.id);
    },

    // 更改球队时，获取数据
    // 对于一个带有动态参数的路径 /foo/:id，
    // 在 /foo/1 和 /foo/2 之间跳转的时候，用watch $route或导航守卫监测变化
    beforeRouteUpdate(to,from,next) {
        // this.currentTeam = this.teams[to.params.id];  currentTeam放在计算属性，这里不再需要
        // 切换球队时，清除alert信息
        this.alert = '';
        next();
    },
    // 或者用watch
    // watch: {
    //     $route(to) {
    //         this.fetchTeam(to.params.id);
    //     }
    // },
    
    // 离开该页面后（相当于离开该组件）。注意必须使用next()
    beforeRouteLeave(to,from,next) {
        this.alert = '';
        next();
    }
}
</script>

<style>
/*搜索球员*/
.search-content {
    display: flex;
    justify-content: space-between;
}
.searchRow>* {
    padding: 3px 0;
    font-size: 14px;
}

/*球员数据表*/
.table-team {
    display: table;
    width: 600px;
    margin: 20px auto;
    font: 14px/2 "Hiragino GB";
    text-align: center;
    border: 1px solid #0041c2;
}
.table-team>h3 {
    display: table-caption;
    text-align: center;
    font-size: 16px;
}
.table-caption {
    position: relative;
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
.table-player:nth-child(even) {
    background: #ebeff4;
}

/*添加、查看球员按钮*/
.add-player {
    position: absolute;
    bottom: 1px;
    right: 0;
}
.playerBtn {
    padding: 2px;
    font-size: 12px;
    background: #9f000f;
    border: none;
    color: #fff;
}
</style>





