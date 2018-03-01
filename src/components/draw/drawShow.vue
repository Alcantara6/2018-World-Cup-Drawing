
<!-- 
    http://localhost:8000/draw
    component: draw-show
-->
<template>
    <div id="draw-show">
        <transition-group name="pot" tag="div" class="teamsContainer">
            <div 
                class="individual-pot" 
                v-for="(pot,index) in potTeams"
                v-if="index == potNum - 1"
                :key="index">
                <h2 v-if="pot.length">{{ `第${pot[0].pot}档` }}</h2>
                <ul class = 'teams'>
                    <li 
                    :class="['team',{'drewTeam':drewTeams.indexOf(team.teamName) !== -1}]" 
                    v-for="team in pot" 
                    :key="team.id">
                        <img :src="team.flagUrl">
                        <div>{{ team.teamName }}</div>
                    </li>
                </ul>
            </div>
        </transition-group>
    </div>
</template>

<script>
export default {
    name: 'draw-show',
    props: {
        teams: Array,
        curTeamName: String,
        potNum: Number
    },
    data() {
        return {
            drewTeams:[]
        }
    },
    computed: {
        potTeams() {
            let pot = [];
            for(let i = 0; i < 4; i++) {
                pot.push(this.teams.slice(8*i, 8*i+8));
            }
            return pot;
        },
        // 不能放在data，data中会一直保持props的初始值
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
.pot-enter-active,
.pot-leave-active {
    transition: all .5s;
}
.pot-enter {
    opacity: 0;
    transform: translateX(150px);
}
.pot-leave-to {
    opacity: 0;
    transform: translateX(-150px);
}

#draw-show {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: 20px;
    color: #fff;
    border: 2px solid #ede275;
    background: #728fce;
}
.teamsContainer {
    display: flex;
    width: 100px;
    margin: 0 auto;
    overflow: hidden;
}

/*每一档*/
.individual-pot {
    flex: none;
    margin-right: 10px;
}

/*每档球队list*/
.teams {
    display: flex;
    flex-direction: column;
    margin-top: 25px;
}
.team {
    display: flex;
    align-items: center;  /*国旗与国名垂直对齐*/
    margin: 20px 40px 0 0;
}
.team img {
    width: 40px;
    margin-right: 15px;
}

/*已抽球队*/
.drewTeam {
    opacity: 0.2;
}
</style>