
<!-- 
    http://localhost:8000/draw
    component: draw-show
-->
<!-- 如何使用非响应式数据？定义局部变量，使其等于data（props）中的数据 -->
<!-- 
    增加不同档切换时的进入离开过渡、增加抽中球队的点亮和变暗状态效果，
    主要运用transform: scaleX和z-index，ES6的扩展运运算符...
    增加开始抽签之前的显示内容
    XXX: 调试bug，过渡元素必须设为定位元素，否则会撑开容器破坏页面结构
-->
<template>
    <div id="draw-show">
        <transition-group name="pot" tag="div" class="teamsContainer" v-if="curPot">
            <!-- 每一档 -->
            <div 
                class="individual-pot"
                v-for="(pot,index) in potTeams"
                v-if="index === curPot - 1"
                :key="index">
                <h2 v-if="pot.length">{{ `第${pot[0].pot}档` }}</h2>
                <ul class = 'teams'>
                    <!-- 每支球队 -->
                    <li 
                    :class="['team', {'drew': drewTeams.indexOf(team.teamName) !== -1}]"
                    v-for="team in pot" 
                    :key="team.id">
                        <img :src="team.flagUrl">
                        <div class="teamName">{{ team.teamName }}</div>
                        <!-- 当前选中球队高亮 -->
                        <transition name="frame">
                            <div class="frame" v-if="team.teamName === curTeamName">
                            </div>
                        </transition>
                    </li>
                </ul>
            </div>
        </transition-group>
        <!-- 开始抽签之前显示 -->
        <div class="pre-draw" v-else>
            <h2 v-for='n in 4'>{{ `第${n}档` }}</h2>
        </div>
    </div>
</template>

<script>
export default {
    name: 'draw-show',
    props: {
        teams: Array,
        curPot: Number,
        curTeamName: String, 
        groupContainer: Array,
    },
    computed: {
        // 从父组件teams计算而得
        potTeams() {
            let pot = [];
            for(let i = 0; i < 4; i++) {
                pot.push(this.teams.slice(8*i, 8*i+8));
            }
            return pot;
        },
        // 不能放在data，data中会一直保持props的初始值
        drewTeams() {
            let results = [];
            // 扩展运算符，ES6
            let places = [].concat(...this.groupContainer);
            // apply(),ES5
            // [].concat.apply([],this.groupContainer); 
            // XXX: 注意是length - 1
            for(let i = places.length - 1; i >= 0; i--) {
                if(typeof places[i].team !== 'undefined') {
                    results.push(places[i].team.teamName);
                }
            }
            return results;
        }
        // 之前是监听curTeamName,加入一个新数组
        // selectedTeam() {
        //    return this.curTeamName;
        // }
    }
    // 多次操作计算属性，用watch。目前来看计算属性setter不能侦听。
    // watch: {
    //     selectedTeam(val) {
    //         this.drewTeams.push(val);
    //     }
    // }
}
</script>

<style scoped>
.pot-enter-active,
.pot-leave-active {
    transition: all 1s;
    /*必须设置positon：absolute，否则会撑开容器，破坏页面结构*/
    position: absolute;
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
    height: 100%;
    color: #fff;
    background: #5471b0;
    border-right: 3px solid #ede275;
    /*.teamsContainer过渡时需要设置positon: absolute; 在#draw-show内进入和移开，以免破坏页面结构*/
    position: relative;   
}
.teamsContainer {
    display: flex;
    text-align: center;
}
/*开始之前的显示*/
.pre-draw {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    text-align: center;
    line-height: 4;
}
.current {
    position: absolute;
    bottom: 20px;
}

/*每一档*/
.individual-pot {
    flex: none;
    width: 100%;
}

/*每档球队list*/
.teams {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
}
.team {
    display: flex;
    align-items: center;  /*国旗与国名垂直对齐*/
    padding: 10px 40px;
    position: relative;  /*用于.frame的100%大小*/
}

/*img和.teamName需要设置positon：relative和index最上，用于高亮scale()过渡*/
.team img {
    width: 40px;
    margin-right: 15px;
    position: relative;
    z-index: 9;
}
.teamName {
    position: relative;
    z-index: 9;
}

/*球队已抽选后状态*/
.drew {
    opacity: 0.3;
}
/*当前被抽中*/
.frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #e55451;
    transform-origin: 0;
}

/*当前抽中球队标记的动画*/
.frame-enter {
    transform: scaleX(0);
}
.frame-leave-to {
   opacity: 0;
}
.frame-enter-active,
.frame-leave-active {
    transition: all 1s;
}
</style>