<!-- 
    http://localhost:8080/teams/teamTable/:id 
-->

<template>
    <div id="players-data">
        <aside class="search">
            <h2>搜索球员</h2>
                <div class="search-content">
                    <div class="searchRow">
                        <label for="name">姓名：</label> 
                        <input type="text" id="name" placeholder="搜索球员名" v-model="searchName">
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
            <h3 class="table-caption" v-if="currentTeam">
                <p>{{ currentTeam.teamName }}队关键球员</p>
                <!-- 跳转到查看球员页面 -->
                <router-link class="add-player playerBtn" to="addPlayer" append tag="button">添加球员
                </router-link>
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
            <ul class="table-player" v-if="filterPlayers.length" v-for="keyPlayer in filterPlayers">
                <li>{{keyPlayer.name}}</li>
                <li>{{keyPlayer.number}}</li>
                <li>{{keyPlayer.role}}</li>
                <li>{{keyPlayer.age}}</li>
                <li>{{keyPlayer.club}}</li>
                <router-link :to="'playerData/' + keyPlayer.playerId" append tag="li">
                    <button class="playerBtn">查看球员信息</button>
                </router-link>
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
    },
    data() {
        return {
            alert: '',
            searchName: '',
            searchRole: '',
            searchClub: '', 
        }
    },
    computed: {
        currentTeam() {
            return this.teams[this.teamId];
        },
        // 筛选球员,不输入或匹配正确则返回true；因为中文字符，不使用正则
        filterPlayers() {
            // props：currentTeam异步传输，初始为undefiend
            // keyPlayer可能未定义
            // 因此需要判断
            if(this.currentTeam && Array.isArray(this.currentTeam.keyPlayers)) {
                let keyPlayers = this.currentTeam.keyPlayers;
                let result = [];
                for(let player of keyPlayers) {
                    const searchMap = new Map([
                        [player.name, this.searchName],
                        [player.role, this.searchRole],
                        [player.club, this.searchClub],
                    ]);
                    if([...searchMap].every(([p, s]) => s === '' || p.includes(s))) {
                        result.push(player);
                    }
                }
                return result;
            }
        }
    },

    mounted() {
        this.$nextTick(function () {
            // 从addPlayer和editPalyer跳转后，路由发生了改变（不是routeUpdate）
            // mounted中监控$route.query
            this.alert = this.$route.query.alert;
        });
    },

    // 更改球队时，获取数据
    beforeRouteUpdate(to,from,next) {
        // 切换球队时，清除alert信息
        this.alert = '';
        next();
    },
    
    // 离开该页面后（相当于离开该组件）。注意必须使用next()
    beforeRouteLeave(to,from,next) {
        this.alert = '';
        next();
    }
}
</script>

<style>
.search>h2 {
    font: 16px/2 'Hiragino GB';
    font-weight: 700;
    margin-bottom: 8px;
}
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
.table-caption {
    display: table-caption;
    text-align: center;
    font-size: 16px;
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





