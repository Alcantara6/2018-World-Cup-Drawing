
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
        :curGroup="curGroup" 
        :drawTeamFlag="drawTeamFlag"></team-Region>
        <group-Region 
        ref="r2" 
        @choose="setCurPos" 
        :curPot="curPot" 
        :curGroup="curGroup" 
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
            curGroup: 0,    // 1-8组   抽取球队之后，抽取位次之前
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
            return String.fromCharCode(this.curGroup+64);
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
        setCurTeam(team) {
            this.curTeam = team;
            // 一般情况下
            this.curGroup = this.sequence;
            // 优化性能，分别在各个轮次判断是否回避
            // 根据if条件，更改alert
            // TODO: 最后两支都是南美洲的情况
            if(this.curPot === 2) {
                // 正常顺序待落位小组中第一位次的球队
                let firstPotTeam = this.groupContainer[this.sequence - 1][0]
                    .team;
                if(team.continent !== '南美洲' 
                    || firstPotTeam.continent !== '南美洲'
                ) {
                    this.alert = `
                        ${this.curTeam.teamName}队进入
                        ${this.groupName}组，请在
                        ${this.groupName}组抽取位置`;
                }
                else {
                    this.skipRoundTwo(team);
                }
            }
            else if(this.curPot === 3) {
                // 正常顺序待落位小组中的欧洲球队
                let euro = this.groupContainer[this.sequence - 1]
                    .filter(item => item.team 
                        && item.team.continent === '欧洲');
                // TODO: 调用非欧洲队同洲回避(包括中北美洲哥斯达黎加墨西哥)
                if(team.continent !== '欧洲' || euro.length < 2) {
                    this.alert = `
                        ${this.curTeam.teamName}队进入
                        ${this.groupName}组，请在
                        ${this.groupName}组抽取位置`;
                }
                else {
                    this.skipRoundThree(team);
                }
            }
            else {
                this.alert = `
                    ${this.curTeam.teamName}队进入
                    ${this.groupName}组，请在
                    ${this.groupName}组抽取位置`;
            }
            this.drawTeamFlag = false;
            this.drawPosFlag = true;
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
                this.$set(this.groupContainer[this.curGroup - 1][position - 1],
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

        // 第二轮非欧洲队（即南美洲）回避
        skipRoundTwo(team) {
            // XXX: 首先给curGroup赋值，跳入下一组
            // XXX: 不能使用++this.sequece，相当于改变sequece，但它没有setter
            this.curGroup = this.sequence + 1;
            // 从下一组开始循环查看
            let i = this.sequence;
            while(i < 8) {
                let firstPotTeam = this.groupContainer[i][0].team;
                // 都不是欧洲队，如果没有遇到同大洲的球队，进入当前curGroup
                // HACK: 跳入的小组不能是已选的
                if(this.groupContainer[i].filter(item => item.team).length 
                    < this.curPot 
                    && firstPotTeam.continent 
                    !== '南美洲') {
                    this.alert = `同大洲不能有两支或以上相同大洲球队（欧洲除外），
                        ${this.curTeam.teamName}队顺延进入
                        ${this.groupName}组。请在
                        ${this.groupName}组抽取位置`;
                    return true;
                }
                else {
                    // XXX: 正常顺序sequence不变，实际待落位组curGroup再往后推进
                    this.curGroup++;
                    i++;
                }
            }
        },
        skipRoundThree(team) {
            this.curGroup = this.sequence + 1;
            let i = this.sequence;
            while(i < 8) {
                let euro = this.groupContainer[i]
                    .filter(item => item.team 
                        && item.team.continent === '欧洲');
                // 如果没有遇到两支欧洲的球队，进入当前curGroup
                if(this.groupContainer[i].filter(item => item.team).length 
                    < this.curPot
                    && euro.length < 2) {
                    this.alert = `
                        同大洲不能有两支以上欧洲球队，
                        ${this.curTeam.teamName}队顺延进入
                        ${this.groupName}组。请在
                        ${this.groupName}组抽取位置`;
                    return true;
                }
                else {
                    this.curGroup++;
                    i++;
                }
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