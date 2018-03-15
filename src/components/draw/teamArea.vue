
<!-- 
    http://localhost:8000/draw
    component: pot-area
-->

<template>
    <div id="team-area">
        <h2>分档区</h2>
        <div class="pots">
            <!-- 每一档的每只球队，随机顺序排列 -->
            <div 
                :class="['individual-pot', {'current-pot': drawTeamFlag && pIndex === curPot - 1}]" 
                v-for="(potTeam,pIndex) in potTeams">
                <h2 v-if="potTeam.length">{{ `第${potTeam[0].pot}档`}}</h2>
                <!-- 球队签的集合 -->
                <div class="teams-container">
                    <!-- 每一档的每只球队，随机顺序排列 -->
                    <transition-group appear class="teams" tag="ul">
                        <li 
                            class="team" 
                            v-for="(team,tIndex) in potTeam"
                            :key="team.id"
                            :style="{transform: `translateX(-50%) rotate(${team.order*45}deg)`}">
                            <!-- 球队国旗+队名 -->
                            <div class="team-content" :style="{transform: `rotate(${team.order*(-45)}deg)`}">
                                <div>{{ team.teamName }}</div>
                                <img :src="team.flagUrl">                    
                            </div>
                            <!-- 球队签遮盖 -->
                            <transition name="frame">
								<div 
								    name="frame"
									:class="['frame',{'default-frame':team.id === 0}]"
									v-if="!team.isDrew" 
									@click="chooseTeam(team,tIndex,potTeam,pIndex)">
								</div>
                            </transition>
                        </li>
                    </transition-group>
                    <!-- 每一档的每只球队结束 -->

                    <!-- 点击打乱顺序 -->
                    <button 
                        :class="['shuffleBtn', {'curpot-shuffle': drawTeamFlag && pIndex === curPot - 1}]" 
                        type="button" 
                        @click="shuffleOrder(pIndex)">打乱
                    </button>
                </div>
            </div>
            <!-- 每一档结束 -->
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
        return {
            potTeams: []    // 从JSON获取
        }
    },


    methods: {
        // 打乱待抽签球队的顺序：改变order属性
        shuffleOrder(pIndex) {
            // 抽签开始之前可以全部打乱，或者抽签开始后只能打乱当前档的球队
            if(!this.curPot || (pIndex === this.curPot - 1)) {
	            let randomOrder = this.randomSort([0,1,2,3,4,5,6,7]);
	            for(let i = 0; i < 8; i++) {
	                this.potTeams[pIndex][i].order = randomOrder[i];
	            }
            }
        },
        // 抽取一支球队
        chooseTeam(team,tIndex,potTeam,pIndex) {
            if(!this.curPot) {
            	alert('请点击start开始');
            }
            else {
	            switch(true) {
	                // 本流程之外不能抽取
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
	        }
        },

        fetchTeams() {
            this.$axios.get("http://localhost:3000/teams")
            .then(res => {
                for(let i = 0; i < 4; i++) {
                    // 获取分档的球队数组
                    this.$set(this.potTeams, i, res.data.slice(i*8, i*8+8));
                    //为每支球队设置初始排列顺序
                    for(let j = 0; j < 8; j++) {
                        this.$set(this.potTeams[i][j], 'order', j);
                    }
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
#team-area {
    /*标题与抽签栏垂直排满*/
    display: flex;  
    flex-direction: column;
    justify-content: space-between;
    margin: 0 50px;   /*左右留出间隔*/
}
/*标题：分档区*/
#team-area>h2 {
    font-size: 20px;
    color: #3090c7;
    font-weight: 700;
    border-bottom: 1px solid #ccc;
    text-align: center;
}
/*所有的分档球队*/
.pots {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: space-between;
}
/*每一档球队*/
.individual-pot {
    width: 200px;
    height: 200px;
    margin: 10px 10px 5px 10px;
    padding: 5px;
    position: relative;
    border: 1px solid #0020c2;
    border-radius: 20px;
    transition: background-color 1s; /* 切换当前档的过渡*/
}
.individual-pot>h2 {
    float: left;
    font: 16px/1 "Hiragino GB";
    font-style: italic;
}
.current-pot {
    background-color: #ffebcd;
    box-shadow: 0px 10px 20px 10px #6698ff inset;
}

/*球队签*/
.team {
    /*国旗和队名居中*/
    display: flex;
    flex-direction: column;
    justify-content: center;
    /*设置所有球队签旋转排列的起始 */
    position: absolute;
    top: 5px;
    left: 50%;
    width: 50px;
    height: 50px;
    /*设置旋转中心，.individual-pot的中心*/
    transform-origin: center 100px;   
    /*外观*/
    border: 1px solid #0020c2;
    border-radius: 50%;
    background: #fff;     /*抽中后显示的背景颜色为白色*/
    /*队名太长溢出时隐藏*/
    overflow: hidden;
    /* 旋转移动过渡，不能用v-move*/
    transition: all .3s;    
}
.team-content {
    text-align: center;
}
.team img {
    border: 1px solid #000;
    width: 25px;
    vertical-align: top;
}

/*打乱按钮*/
.shuffleBtn {
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 5px 10px;
    transform: translate(-50%,-50%);  /*居中*/
    background-color: #306eff;
    border: 1px solid #ccc;
    border-radius: 5px;
    color: #fff;
    line-height: 2;
    outline-width: 0;
}
.curpot-shuffle:hover {
    background-color: #43bfc7;
}

/*球队签遮盖*/
.frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-image: url(../../assets/football.jpg);
    background-size: 100% 100%;
    background-position: center;
    cursor: pointer;
    transition: all 1s;   /*旋转过渡*/
}
.frame:hover {
    transform: rotate(270deg);
}
.default-frame {
    background-image: url(../../assets/football-red.jpg);
}
.frame-enter,
.frame-leave-to {
	opacity: 0;
}
.frame-enter-active,
.frame-leave-active {
	transition: all 1s;
}
</style>