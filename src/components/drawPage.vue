
<!-- http://localhost:8000/draw -->

<!-- 程序的复杂性主要在于回避原则和alert提醒 -->
<!-- 2-17 
    1.打乱签的顺序，使用v-move过渡；2.使用props和$emit传递状态，暂不用bus和vuex 
-->
<!-- 2-21 
    groupContainer创建JSON文件，把选中的Object{team}加入，
    确认抽签结果传入JSON,json server不能用post
-->
<!-- 2.22 
    1. 更改流程，先抽队，再确定小组，以显示回避原则，用计算属性表示正常顺序的小组落位，以此为基础得到实际的小组落位
    2. 因为回避原则，设置当前分档时不能根据是否为第8组判断，curPot放在计算属性
    : groupContainer先用空数组，就可用length判断，否则每次要查询team属性
    3. TODO: 组件、方法复用，函数封装，例如如何复用回避原则的方法
-->
<!-- 2.22 
    TODO: 避免某一档剩最后几只球队时无法满足回避原则
-->
<!-- 2.23 
    根据欧洲、非欧洲条件判断进行回避算法，覆盖所有球队的回避情况，
    alert内容用一个方法封装，代码简化20%以上
    TODO: 用mixin混入通用方法 
-->
<!-- 3.2
    优化页面样式，分区块
    增加多个逻辑，在不同阶段对应元素显示高亮样式
-->

<template>  
    <div id="draw">
        <!-- 抽签流程提示 -->
        <div class="alert">
            <button class="statusBtn" v-if="curRound === 0" @click.once="start">
                START
            </button>
            <button class="statusBtn" v-else-if="curRound === -1" @click.once="createResult">
                请确认抽签结果
            </button>            
            <button class="statusBtn" v-else>
                抽签进行中…………
            </button>
            <div class="procedure" v-if="curRound >= 0">{{ alert }}</div>
            <button @click="enterGroup">确认落位</button>
            <div class="current-mark" v-if="curRound > 0">
                当前第<strong>{{ curPot }}</strong>档，
                从<strong>{{ orderGroupName }}</strong>组开始落位
            </div>
        </div>

        <!-- 抽签操作区域 -->
        <section id="main">
            <div id="live">
                <!-- 球队抽选区 -->
                <team-Area
                    ref="r1" 
                    @choose="setCurTeam" 
                    :curPot="curPot" 
                    :curGroupNum="curGroupNum" 
                    :drawTeamFlag="drawTeamFlag">
                </team-Area>
                <!-- 小组位次抽选区 -->
                <group-Area 
                    ref="r2" 
                    @choose="setCurPos" 
                    :curPot="curPot" 
                    :curGroupNum="curGroupNum" 
                    :drawPosFlag="drawPosFlag">
                </group-Area>
            </div>
            <!-- 已选待选球队 -->
            <aside id="teams-status">
                <draw-show
                    :teams="teamList"
                    :potNum="curPot"
                    :groupContainer="groupContainer"
                    :curTeamName="curTeam.teamName">
                </draw-show>
            </aside>   
        </section>
        <!-- id="main"结束 -->
        
        <!--分组结果展示 -->
        <footer class="result">
            <grouping-result 
                :groupContainer="groupContainer"
                :curGroupNum="curGroupNum">
            </grouping-result>
        </footer>
    </div>
</template>

<script>
import Qs from 'qs';
import teamArea from './draw/teamArea';
import groupArea from './draw/groupArea';
import groupingResult from './draw/groupingResult';
import drawShow from './draw/drawShow';
export default {
    name: 'draw',
    components: {
        teamArea,
        groupArea,
        groupingResult,
        drawShow
    },
    data() {
        return {
            teamList: [],
            // groupContainer从JSON引入（因空数组不好渲染DOM），因此不能通过length区别，增加team属性，通过包含team属性的情况进行判定
            groupContainer: [],
            curRound: 0,    // 1-32轮  抽取球队之前
            curGroupNum: 0, // 1-8组   抽取球队之后，抽取位次之前
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

                case this.curRound > 0 && this.curRound <= 8:
                    return 1;
                    break;

                default:
                    return 0;
                    break;
            }
        },
        // 正常顺序下待落位小组：总是从第一个已抽球队<轮次的组开始
        // 抽取球队之前
        orderGroupNum() {
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
        orderGroupName() {
            return String.fromCharCode(this.orderGroupNum+64);
        },
        curGroupName() {
            return String.fromCharCode(this.curGroupNum+64);
        }
    },


    methods: {   
        // 开始抽签
        start() {
            for(let i = 0; i < 4; i++) {
                this.$refs.r1.shuffleOrder(i);
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
         * 自定义事件 from teamArea.vue
         * @event click
         * @param {Object} team 从子组件teamArea.vue传入选取的team
         */
        setCurTeam(selectedTeam) {
            // 一般情况下
            this.curTeam = selectedTeam;
            this.curGroupNum = this.orderGroupNum;
            // 抽第一档不涉及回避
            if(this.curPot === 1) {
                this.diffAlert(selectedTeam,this.orderGroupNum,this.curGroupNum);
            }
            // 针对非欧洲球队的回避
            else if(selectedTeam.continent !== '欧洲') {
                this.avoidNonEuro(selectedTeam);
            }
            // 针对欧洲球队的回避
            else {
               this.avoidEuro(selectedTeam);
            }
            this.drawTeamFlag = false;
            this.drawPosFlag = true;
        },
        // 针对非欧洲球队的回避方法
        avoidNonEuro(selectedTeam) {
            // 从顺位的当前小组开始检查
            while(this.curGroupNum <= 8) {
                let group = this.groupContainer[this.curGroupNum - 1];
                let teamsLen = group.filter(item => item.team).length;
                let isEncounter = group.some(item => item.team 
                    && item.team.continent === selectedTeam.continent);
                // 如果该组本轮还没有落位球队，或同洲球队没相遇，curGroup确定
                if(teamsLen < this.curPot && !isEncounter) {
                    this.diffAlert(selectedTeam,this.orderGroupNum,this.curGroupNum);
                    break;
                }
                else {
                    this.curGroupNum++;
                }
            }
        },
        // 针对欧洲球队的回避方法
        avoidEuro(selectedTeam) {
            // 从顺位的当前小组开始检查
            while(this.curGroupNum <= 8) {  
                let group = this.groupContainer[this.curGroupNum - 1];
                let teamsLen = group.filter(item => item.team).length;
                let euroTeams = group.filter(item => item.team 
                    && item.team.continent === "欧洲");
                // 如果该组本轮还没有落位球队，或小于两支欧洲球队
                if(teamsLen < this.curPot && euroTeams.length < 2) {
                    this.diffAlert(selectedTeam,this.orderGroupNum,this.curGroupNum);
                    break;
                }
                else {
                    this.curGroupNum++;
                }
            }
        },
        // 显示球队分组落位结果
        diffAlert(team,cur,seq) {
            if(cur === seq) {
                this.alert = `
                    ${this.curTeam.teamName}队进入
                    ${this.curGroupName}组，请在
                    ${this.curGroupName}组抽取位置`;
            }
            else if(team.continent !== "欧洲"){
                this.alert = `
                    同一小组不能有相同大洲的球队（欧洲除外），
                    ${this.curTeam.teamName}队顺延进入
                    ${this.curGroupName}组。请在
                    ${this.curGroupName}组抽取位置`;
            }
            else {
                this.alert = `
                    同大洲不能有两支以上欧洲球队，
                    ${this.curTeam.teamName}队顺延进入
                    ${this.curGroupName}组。请在
                    ${this.curGroupName}组抽取位置`;
            }
        },


        /**
         * 设置当前抽取的位置
         * 自定义事件 from groupArea.vue
         * @event click
         * @param {Object} team 从子组件groupArea.vue传入选取的pos
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
                // 将抽取到的球队落入抽取到的小组位次
                this.$set(this.groupContainer[this.curGroupNum - 1][position - 1], 'team', this.curTeam);
                this.alert = `请从第${this.curPot}档抽取一支球队`;
                this.drawTeamFlag = true;
                // 最后一轮之前，确认球队落位后，轮次增加1
                if(this.curRound < 32) {
                    this.curRound ++;
                } else {
                    // 最后一支球队落位后，将轮次赋值为-1
                    this.curRound = -1;
                }
            }
        },

        createResult() {
            // 抽签结果传入后端
            let len = this.groupContainer.length;
            for(let i = 0; i < len; i++) {
                this.$axios.post(
                    `http://localhost:3000/result`,
                    Qs.stringify(this.groupContainer[i]),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                .then(res => {
                    console.log(res);
                })
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
/*总体布局*/
#draw {
    min-width: 784px;
    position: relative;
    border: 2px solid #0020c2;
}
#main {
    display: flex;
}
#live {
    flex: 1;
    display: flex;
}
#teams-status {
    flex: 0 0 15%;
    order: -1;
}
/* live */
#team-area {
    flex: 55%;
}
#group-area {
    flex: 45%;
}

/*alert*/
.alert {
    display: flex;
    justify-content: space-around;
    position: absolute; 
    width: 100%;     /*绝对定位后，宽度等于内容实际宽度*/
    bottom: -50px;  /*始终位于内容区下方*/
}
.alert>* {
    margin-right: 50px;
    text-align: center;
    font-size: 14px;
}
/*操作流程提示*/
.procedure,
.current-mark {
    width: 280px;
    padding: 10px 20px;
    color: #fff;
    background: #7f525d;
}
/*当前抽签信息*/
.current-mark {
    background: #6698ff;
}
/*进行状态按钮*/
.statusBtn {
    width: 150px;
    background: #f0f8ff;
    border-radius: 8px;
    outline-width: 0;
}
/* Color Variables

@colordef #6960EC;hover
@colordef #2B65EC;Ocean Blue
@colordef #1589FF;dodger Blue(宝蓝)
@colordef #FFC;cream(米黄冰淇淋)
@colordef #F5F5F5;white-smoke(淘宝导航tab背景)
@colordef #FEFCFF;Milk White
@colordef #e7e8e1;www.bbc.com背景
@colordef #f0f8ff;AliceBlue(浅蓝白btn按钮)
@colordef #c2dfff;seaBlue
*/
</style>