
<!-- 
    http://localhost:8000/draw
    component: pot-area
-->
<!--
    2-12:解决了随机排序的问题(操作data数据，data从后端引入)，抽签数据重复的问题（要第一层$set） 
-->
<!-- 2-23 多个if判断，换用switch;
     组合分档球队，filter()改用slice()简化代码 -->
<!-- 新的一种乱序方法 -->
<!-- 计算属性不能传参 -->
<!-- XXX: 2-28 球队区球队用CSS3 transform: rotate + positon: absolute做环形排列。
随机打乱球队时，过渡出现问题，会聚集到一起，可能是列表渲染机制造成的问题。
将随机排列算法与transform属性绑定，用v-bind:style内联方式，对每一档绑定。
order不能用全局变量，否则点击每一档的随机打乱按钮所有档都会变化；给每一档每支球队
分别添加order属性，注意必须使用$Set添加才能是响应式的。 -->
<template>
    <div id="team-area">
        <h2>分档区</h2>
        <div class="pots">
            <!-- 每一档的球队 -->
            <div class="individual-pot" v-for="(potTeam,pIndex) in potTeams">
                <h2 v-if="potTeam.length">{{ `第${potTeam[0].pot}档`}}</h2>
                <!-- 开始抽签-->
                <div class="draw-teams">
                    <transition-group appear class="teams" tag="ul">
                        <!-- 每一档的每只球队，随机排列 -->
                        <!-- style: [{},{},{}...] -->
                        <li 
                            class="team" 
                            v-for="(team,tIndex) in potTeam" 
                            :key="team.id"
                            :style="{transform: `translateX(-50%) rotate(${team.order*45}deg)`}">
                            <div>{{ team.teamName }}</div>
                            <img :src="team.flagUrl">
    <!--                         <div 
                                :class="['frame',{'default-frame':team.id === 0}]" 
                                v-if="!team.isDrew" 
                                @click="chooseTeam(team,tIndex,potTeam,pIndex)">
                            </div> -->
                        </li>
                    </transition-group>
                    <button 
                        class="shuffleBtn" 
                        type="button" 
                        @click="shuffleOrder(pIndex)">shuffle
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'team-area',
    props: {
        curPot: Number,
        curGroupNum: Number,
        drawTeamFlag: {
            type: Boolean,
            default: false
        }
    },
    data() {
        /**
         * 因为有事件打乱球队顺序。
         * 1. 计算属性？不能用方法改变计算属性即要操作原始数据，
         * 2. v-for methods获取？多次渲染问题
         * 3. 从父组件获取，不能更改子组件数据，也不能把引用类型赋给data
         * 4. 所以要操作data数据，但初始要有potTeams,因此axios获取，
         */
        return {
            potTeams: []
            // randomArr: [
            //     [0,1,2,3,4,5,6,7],
            //     [0,1,2,3,4,5,6,7],
            //     [0,1,2,3,4,5,6,7],
            //     [0,1,2,3,4,5,6,7]
            // ]
        }
    },
    methods: {
        shuffleOrder(pIndex) {
            // TODO: setInterval自动多次打乱
            // 之前是将球队顺序打乱
            // *this.$set(
            //     this.potTeams, idx, this.randomSort(this.potTeams[idx])
            // );
            let randomOrder = this.randomSort([0,1,2,3,4,5,6,7]);
            for(let i = 0; i < 8; i++) {
                this.potTeams[pIndex][i].order = randomOrder[i];
            }
            // this.$set(this.randomArr, pIndex, this.randomSort([0,1,2,3,4,5,6,7]));
        },
        chooseTeam(team,tIndex,potTeam,pIndex) {
            // 抽取球队
            switch(true) {
                case !this.drawTeamFlag:
                    alert('该流程不能抽选球队');
                    break;

                // 只能在本档选择
                case pIndex !== this.curPot - 1:
                    alert(`请在第${this.curPot}档选择`);
                    break;

                //第一支必须抽东道主俄罗斯 
                case this.curPot === 1 && this.curGroupNum === 0 && team.id !== 0:
                    alert("选择红色小球-东道主俄罗斯自动进入A组");
                    break;

                default:
                    this.$set(team, 'isDrew', true);
                    this.$emit('choose',team);
                    break;
            }
        },
        fetchTeams() {
            this.$axios.get("http://localhost:3000/teams")
            .then(res => {
                for(let i = 0; i < 4; i++) {
                    this.$set(this.potTeams, i, res.data.slice(i*8, i*8+8));
                    for(let j = 0; j < 8; j++) {
                        this.$set(this.potTeams[i][j], 'order', j);
                    }
                }
                // 对于等长数组，用slice获取以简化代码
                /* this.potTeams = [
                    res.data.filter(item => 
                        item.pot === 1
                    ),
                    res.data.filter(item => 
                        item.pot === 2
                    ),
                    res.data.filter(item => 
                        item.pot === 3
                    ),
                    res.data.filter(item => 
                        item.pot === 4
                    )
                ];*/
                // 改为每次点选后设置，精简代码
                /* for(let i = this.potTeams.length - 1; i >= 0; i--) {
                    this.potTeams[i].forEach(item => {
                        if(typeof item.isDrew === 'undefined') {
                            // 注意不能直接加属性，注意'isDrew'要加引号  
                            this.$set(item, 'isDrew', false);
                        }
                    });
                }*/
            })
            .catch(error => {
              console.log(error);
            });    
        },
        randomSort(arr) {
            // XXX: 后面的.splice()会改变原数组（data数据），所以要复制一个temp
            let temp = arr.slice(0);
            let result = [];
            for(let i = arr.length - 1; i >= 0; i--) {
                let rdIndex = Math.floor(Math.random()*temp.length);
                result[i] = temp[rdIndex];
                temp.splice(rdIndex,1);  
            }
            return result;
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.fetchTeams();
        });
    }
}
</script>

<style scoped>
#team-area {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
}
.pots {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: space-between;
}
.individual-pot {
    width: 250px;
    height: 250px;
    margin: 10px 20px 0 0;
    padding: 5px;
    position: relative;
    border: 1px solid #0020c2;
}
.individual-pot>h2 {
    float: left;
}
.team {
    position: absolute;
    top: 2px;
    left: 50%;
    width: 60px;
    height: 60px;
    border: 1px solid #0020c2;
    border-radius: 50%;
    transform-origin: center 125px;
    transition: all 1s;    /* 不能用v-move*/
}
.team img {
    border: 1px solid #000;
    width: 35px;
}
.shuffleBtn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
/*key*/
.frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #ffc;
}
.default-frame {
    background-color: #f00;
}
</style>