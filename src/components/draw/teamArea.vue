
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
分别添加order属性，注意必须使用$Set添加才能是响应式的。 
-->
<!-- 2.29 国旗与队名保持水平方向：绕自身中心点rotate与外圆相反的角度 -->
<!-- 3.2 设置不同阶段是否可点击打乱球队 -->
<template>
    <div id="team-area">
        <h2>分档区</h2>
        <div class="pots">
            <!-- 每一档的球队 -->
            <div 
                :class="['individual-pot', {'current-pot': pIndex === curPot - 1}]" 
                v-for="(potTeam,pIndex) in potTeams">
                <h2 v-if="potTeam.length">{{ `第${potTeam[0].pot}档`}}</h2>
                <!-- 开始抽签-->
                <div class="teams-container">
                    <transition-group appear class="teams" tag="ul">
                        <!-- 每一档的每只球队，随机顺序排列 -->
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
                    <!-- 点击打乱顺序 -->
                    <button 
                        :class="['shuffleBtn', {'curpot-shuffle': drawTeamFlag && pIndex === curPot - 1}]" 
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
         * v-for获取打乱后的球队，因为有事件打乱球队顺序。
         * 1. 计算属性？不能用方法改变计算属性即要操作原始数据，
         * 2. v-for methods获取？多次渲染问题
         * 3. 从父组件获取，不能更改子组件数据，也不能把引用类型赋给data
         * 4. 所以要操作data数据，但初始要有potTeams,因此axios获取，
         */
        // rev:打乱球队改为动态绑定style，要操作数据加入order属性，因此还是需要axios获取
        return {
            potTeams: []
        }
    },


    methods: {
        shuffleOrder(pIndex) {
            // 之前方法是将球队数据打乱顺序
            // this.$set(
            //     this.potTeams, idx, this.randomSort(this.potTeams[idx])
            // );
            // 抽签开始之前可以全部打乱，或者抽签开始后只能打乱当前档的球队
            if(!this.curPot || (pIndex === this.curPot - 1)) {
	            let randomOrder = this.randomSort([0,1,2,3,4,5,6,7]);
	            for(let i = 0; i < 8; i++) {
	                this.potTeams[pIndex][i].order = randomOrder[i];
	            }
            }
        },
        chooseTeam(team,tIndex,potTeam,pIndex) {
            // 抽取球队
            if(!this.curPot) {
            	alert('请点击start开始');
            }
            else {
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
                // 对于等长数组，用slice获取以简化代码；非等长数组，用filter,例如获取各大洲球队
                
                // isDrew属性改为每次点选后设置，精简代码。以下为统一设置。
                /*for(let i = this.potTeams.length - 1; i >= 0; i--) {
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
    margin: 10px 30px 10px 0;
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
    transform-origin: center 100px;   /*设置旋转中心，.individual-pot的中心*/
    /*外观*/
    border: 1px solid #0020c2;
    border-radius: 50%;
    background: #fff;     /*抽中后显示的背景颜色为白色*/
    /*队名太长溢出时隐藏*/
    overflow: hidden;
    /* 旋转移动过渡，不能用v-move*/
    transition: all 1s;    
}
.team-content {
    text-align: center;
}
.team img {
    border: 1px solid #000;
    width: 25px;
    vertical-align: top;
}
.shuffleBtn {
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 5px;
    transform: translate(-50%,-50%);  /*居中*/
    background-color: #306eff;
    border: 1px solid #ccc;
    border-radius: 5px;
    color: #fff;
    cursor: default;   /*非本档情况下默认光标*/
    line-height: 2;
    outline-width: 0;
}
.curpot-shuffle:hover {
    background-color: #4e8cff;
    cursor: pointer;  /*可选时的光标*/
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
    background: #fff;
    box-shadow: 20px 0px 2px 20px #f70d1a inset;
}
.frame-enter,
.frame-leave-to {
	opacity: 0;
}
.frame-enter,
.frame-leave-to {
	transition: all 1s;
}
</style>