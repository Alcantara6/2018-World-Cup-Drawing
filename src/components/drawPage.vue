
<!-- http://localhost:8000/draw -->
<!-- todo: fetchTeam是否可以放到APP.vue -->
<!-- 2-17 
1.打乱签的顺序，使用v-move过渡；2.使用props和$emit传递状态，暂不用bus和vuex 
-->
<!-- 2-21 groupContainer创建JSON文件，把选中的Object{team}加入，不能用post，可以用put
-->
<!-- 2.22 
    1. 更改流程，先抽队，再确定小组，以显示回避原则，用计算属性表示正常顺序的小组落位，以此为基础得到实际的小组落位
    2. 因为回避原则，设置当前分档时不能根据是否为第8组判断，curPot放在计算属性
    TODO: groupContainer先用空数组，就可用length判断，否则每次要查询team属性
    3. TODO: 组件、方法复用，函数封装，例如如何复用回避原则的方法
-->
<!-- 2.22 
    TODO: 避免某一档剩最后几只球队时无法满足回避原则
-->
<!-- 根据欧洲、非欧洲条件判断进行回避算法，覆盖所有球队的回避情况，alert内容用一个方法封装，代码简化20%以上 -->
<!-- 程序的复杂性主要在于回避原则和alert提醒 -->
<template>
    <div id="draw">
        <header class="alert">
            <div class="procedure">{{ alert }}</div>
            <div class="current-mark" v-if="curRound">第<strong>{{ curPot }}</strong>档，<strong>{{ sequenceName }}</strong>组开始落位</div>
            <button type="button" @click.once="start">start</button>
        </header>
        <team-Region
        ref="r1" 
        @choose="setCurTeam" 
        :curPot="curPot" 
        :curGroupNum="curGroupNum" 
        :drawTeamFlag="drawTeamFlag"></team-Region>
        <group-Region 
        ref="r2" 
        @choose="setCurPos" 
        :curPot="curPot" 
        :curGroupNum="curGroupNum" 
        :drawPosFlag="drawPosFlag"></group-Region>
        <grouping-result 
        ref="r3"
        @enter="enterGroup" 
        :groupContainer="groupContainer" 
        ></grouping-result>
        <draw-show :teams="teamList" :curTeamName="curTeam.teamName"></draw-show>
    </div>
</template>

<script>
// import Qs from 'qs';
import teamRegion from './draw/teamRegion';
import groupRegion from './draw/groupRegion';
import groupingResult from './draw/groupingResult';
import drawShow from './draw/drawShow';
export default {
    name: 'draw',
    components: {
        teamRegion,
        groupRegion,
        groupingResult,
        drawShow
    },
    data() {
        return {
            teamList: [],
            // groupContainer从JSON引入（因空数组不好渲染DOM），因此不能通过length区别，增加team属性，通过包含team属性的情况进行判定
            groupContainer: [],
            curRound: 0,    // 1-32轮  抽取球队之前
            curGroupNum: 0,    // 1-8组   抽取球队之后，抽取位次之前
            curTeam: {},    // 抽中的球队
            curPos: '',     // 抽中的位次。1-4位。如'A1','A2','A3','A4'
            alert: '请点击start开始抽签，并根据提示流程操作',
            drawTeamFlag: false,
            drawPosFlag: false,
        }
    },


    computed: {
        curPot() {
            // 设置当前抽取的档
            // 因为回避原则，设置当前分档时不能根据是否为第8组判断
            switch (true) {
                case this.curRound > 24:
                    return 4;
                    break;

                case this.curRound > 16 && this.curRound <= 24:
                    return 3;
                    break;

                case this.curRound > 8 && this.curRound <= 16:
                    return 2;
                    break;

                default:
                    return 1;
                    break;
            }
        },
        // 正常顺序下待落位小组：总是从第一个已抽球队<轮次的组开始
        // 抽取球队之前
        sequence() {
            let groupIdx = 1;
            for(let i = 1; i <= 8; i++) {
                let occupy = this.groupContainer[i-1]
                    .filter(item => item.team);
                if (occupy.length < this.curPot) {
                    break;
                    // XXX: continue是全部循环，会遍历所有，应该用break
                }
                groupIdx++;
            }
            // 如果8个组全都跳过，返回第1组
            return groupIdx === 9?1:groupIdx;
        },
        // 小组序号转换为小组名: fromCharCode
        sequenceName() {
            return String.fromCharCode(this.sequence+64);
        },
        groupName() {
            return String.fromCharCode(this.curGroupNum+64);
        }
    },


    methods: {   
        // 开始抽签
        start() {
            for(let i = 0; i < 4; i++) {
                this.$refs.r1.shuffleTeam(i);
            }            
            for(let i = 0; i < 8; i++) {
                this.$refs.r2.shuffleGroup(i);
            }
            this.curRound = 1;
            this.alert = "请从第一档红色小球抽取东道主俄罗斯队";
            this.drawTeamFlag = true;
        },

        /**
         * 设置当前抽取的球队
         * 自定义事件 from teamRegion.vue
         * @event click
         * @param {Object} team 从子组件teamRegion.vue传入选取的team
         */
        setCurTeam(selectedTeam) {
            // 一般情况下
            this.curTeam = selectedTeam;
            this.curGroupNum = this.sequence;
            // 抽第一档不涉及回避
            if(this.curPot === 1) {
                this.diffAlert(selectedTeam,this.sequence,this.curGroupNum);
            }
            // 针对非欧洲球队的回避
            else if(selectedTeam.continent !== '欧洲') {
                // 从顺位的当前小组开始检查
                while(this.curGroupNum <= 8) {  
                    let group = this.groupContainer[this.curGroupNum - 1];
                    let teamsLen = group.filter(item => item.team).length;
                    let isEncounter = group.some(item => item.team 
                        && item.team.continent === selectedTeam.continent);
                    // 如果该组本轮还没有落位球队，或同洲球队没相遇，curGroup确定
                    if(teamsLen < this.curPot && !isEncounter) {
                        this.diffAlert(selectedTeam,this.sequence,this.curGroupNum);
                        break;
                    }
                    else {
                        this.curGroupNum++;
                    }
                }
            }
            // 针对欧洲球队的回避
            else {
                // 从顺位的当前小组开始检查
                while(this.curGroupNum <= 8) {  
                    let group = this.groupContainer[this.curGroupNum - 1];
                    let teamsLen = group.filter(item => item.team).length;
                    let euroTeams = group.filter(item => item.team 
                        && item.team.continent === "欧洲");
                    // 如果该组本轮还没有落位球队，或小于两支欧洲球队
                    if(teamsLen < this.curPot && euroTeams.length < 2) {
                        this.diffAlert(selectedTeam,this.sequence,this.curGroupNum);
                        break;
                    }
                    else {
                        this.curGroupNum++;
                    }
                }

            }
            this.drawTeamFlag = false;
            this.drawPosFlag = true;
        },
        diffAlert(team,cur,seq) {
            if(cur === seq) {
                this.alert = `
                    ${this.curTeam.teamName}队进入
                    ${this.groupName}组，请在
                    ${this.groupName}组抽取位置`;
            }
            else if(team.continent !== "欧洲"){
                this.alert = `
                    同一小组不能有相同大洲的球队（欧洲除外），
                    ${this.curTeam.teamName}队顺延进入
                    ${this.groupName}组。请在
                    ${this.groupName}组抽取位置`;
            }
            else {
                this.alert = `
                    同大洲不能有两支以上欧洲球队，
                    ${this.curTeam.teamName}队顺延进入
                    ${this.groupName}组。请在
                    ${this.groupName}组抽取位置`;
            }
        },
        /**
         * 设置当前抽取的位置
         * 自定义事件 from groupRegion.vue
         * @event click
         * @param {Object} team 从子组件groupRegion.vue传入选取的pos
         */
        setCurPos(pos) {
            this.curPos = pos.num;
            this.alert = `
                ${this.curTeam.teamName}队进入
                ${this.curPos}位,请点击确认落位`;
            this.drawPosFlag = false;
        },

        // 将抽取的球队落位至小组
        // 过程中不用将结果传入后端
        enterGroup() {
            // 开始之前或正在抽取球队、抽取位次时点击无效
            if(this.curRound && !this.drawTeamFlag && !this.drawPosFlag) {
                let position = this.curPos.slice(1);
                this.$set(this.groupContainer[this.curGroupNum - 1][position - 1],
                    'team', this.curTeam);
                /* 抽签结果传入后端
                    let targetId = targetPos.id; 
                    this.$axios.put(
                        `http://localhost:3000/groups/${targetId}`,
                        // Qs.stringify(this.curTeam),
                        targetData
                        // {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
                        )
                    .then(res => {
                        console.log(res);
                        // 调用，设置当前轮次，小组
                        this.setCurRoundGroup();
                    })
                */
            this.curRound ++;
            this.alert = `请从第${this.curPot}档抽取一支球队`;
            this.drawTeamFlag = true;
            }
        },
        
        // 获取球队数据
        fetchTeams() {
            this.$axios.get("http://localhost:3000/teams").then(res => {
                this.teamList = res.data;
            })
            .catch(error => {
              console.log(error);
            });    
        },
        // 获取分组
        fetchGroups() {
            this.$axios.get("http://localhost:3000/groups").then(res => {
                for(let i = 0; i < 8; i ++) {
                    this.$set(this.groupContainer, i, 
                        res.data.slice(i*4,i*4+4));
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    },


    mounted() {
        this.$nextTick(function () {
            this.fetchTeams();
            this.fetchGroups();
        });
    }
} 
</script>

<style scoped>
#draw {
    min-width: 320px;
    overflow: hidden;
}
.alert {
    width: 600px;
    margin: 0 auto 10px;
    text-align: center;
    font-size: 18px;
}
.procedure {
    padding: 10px 20px;
    color: #fff;
    background: #6698ff;
}
.current-mark {
    width: 200px;
    margin: 0 auto;
    color: #000;
    background: #ff0;
}
</style>