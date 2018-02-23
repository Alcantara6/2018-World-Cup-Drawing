
<!-- 
    http://localhost:8000/draw
    component: draw-show
-->
<template>
    <div id="draw-show">
        <div class="individual-pot" v-for="pot in potTeams">
            <h2 v-if="pot.length">{{ `第${pot[0].pot}档` }}</h2>
            <ul>
                <li 
                :class="['team',{'drewTeam':drewTeams.indexOf(team.teamName) !== -1}]" 
                v-for="team in pot" 
                :key="team.id">
                    <img :src="team.flagUrl">
                    <div>{{ team.teamName }}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'draw-show',
    props: {
        teams: Array,
        curTeamName: String
    },
    data() {
        return {
            drewTeams:[]
        }
    },
    computed: {
        potTeams() {
            return  [
                        this.teams.filter(item => 
                            item.pot === 1
                        ),
                        this.teams.filter(item => 
                            item.pot === 2
                        ),
                        this.teams.filter(item => 
                            item.pot === 3
                        ),
                        this.teams.filter(item => 
                            item.pot === 4
                        )
                    ]
        },
        // 不能放在data，一直保持props的初始值
        selectedTeam() {
            return this.curTeamName;
        }
    },
    // 多次操作计算属性，用watch。目前来看计算属性setter不能侦听。
    watch: {
        selectedTeam(val) {
            this.drewTeams.push(val);
        }
    }
} 
</script>

<style scoped>
#draw-show {
    width: 780px;
    margin: 50px auto;
    text-align: center;
}
.individual-pot>h2 {
    float: left;
}
.individual-pot>ul {
    margin: 0 0 20px 40px;    
}
.team {
    display: inline-block;
    width: 60px;
    margin-right: 20px;
    text-align: center;
}
.team img {
    border: 1px solid #000;
    width: 40px;
}
.drewTeam {
    opacity: 0.2;
}
</style>