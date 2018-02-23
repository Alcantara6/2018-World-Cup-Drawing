
<!-- 
    http://localhost:8000/draw
    component: pot-area
-->
<!--
    2-12:解决了随机排序的问题(操作data数据，data从后端引入)，抽签数据重复的问题（要第一层$set） 
-->
<template>
    <div id="team-region">
        <h1>分档区</h1>
        <!-- 每一档的球队 -->
        <div class="individual-pot" v-for="(potTeam,pIndex) in potTeams">
            <h2 v-if="potTeam.length">{{ `第${potTeam[0].pot}档`}}</h2>
            <!-- 开始抽签-->
            <button 
            class="shuffleBtn" 
            type="button" 
            @click="shuffleTeam(pIndex)">shuffle the teams</button>
            <transition-group tag="ul" name="flip-list">
                <!-- 每一档的每只球队，随机排列 -->
                <li 
                class="team" 
                v-for="(team,tIndex) in potTeam" 
                :key="team.id">
                    <span>{{ team.id }}</span>
                    <img :src="team.flagUrl">
                    <div>{{ team.teamName }}</div>
                    <div 
                    :class="['frame',{'default-frame':team.id === 0}]" 
                    v-if="!team.isDrew" 
                    @click="chooseTeam(team,tIndex,potTeam,pIndex)">
                    </div>
                </li>
            </transition-group>
        </div>
    </div>
</template>

<script>
export default {
    name: 'team-region',
    props: {
        curPot: Number,
        curGroup: Number,
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
            potTeams: [],
        }
    },
    methods: {
        chooseTeam(team,tIndex,potTeam,pIndex) {
            // 抽取球队
            if(!this.drawTeamFlag) {
                alert('该流程不能抽选球队');
                return false;
            }
            // 只能在本档选择
            if(pIndex !== this.curPot - 1) {
                alert(`请在第${this.curPot}档选择`);
                return false;
            }
            // 第一支必须抽东道主俄罗斯
            if(this.curPot === 1 && this.curGroup === 0) {
                if(team.id !== 0) {
                    alert("选择红色小球-东道主俄罗斯自动进入A组");
                    return false;
                }
            }
            // if(typeof team.isDrew === 'undefined') {
            //     this.$set(team, 'isDrew', true);
            // }
            // else {
            //     team.isDrew = true;
            // }
            team.isDrew = true;
            this.$emit('choose',team);
        },
        shuffleTeam(idx) {
            // TODO: setInterval自动多次打乱
            this.$set(
                this.potTeams, idx, this.randomSort(this.potTeams[idx])
            );
            // this.$set(this.potTeams[idx],…) 错误！这相当于直接给数组项赋值
        },
        fetchTeams() {
            this.$axios.get("http://localhost:3000/teams")
            .then(res => {
                this.potTeams = [
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
                ];
                // 可每次点选后设置
                for(let i = this.potTeams.length - 1; i >= 0; i--) {
                    this.potTeams[i].forEach(item => {
                        if(typeof item.isDrew === 'undefined') {
                            // 注意不能直接加属性，注意'isDrew'要加引号  
                            this.$set(item, 'isDrew', false);
                        }
                    });
                }
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
#team-region {
    float: left;
}
.team {
    display: inline-block;
    width: 60px;
    margin-right: 2px;
    border: 1px solid #0020c2;
    text-align: center;
    position: relative;  /*key*/
}
.team img {
    border: 1px solid #000;
    width: 40px;
}
/*key*/
.frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffc;
}
.default-frame {
    background-color: #f00;
}
.flip-list-move {
    transition: all .1s;
}
</style>