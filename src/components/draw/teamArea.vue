
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
                :class="['individual-pot', {'current-pot': drawTeamFlag && pIndex === curPot - 1}]" 
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
                        @click="shuffleOrder(pIndex)">打乱
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
            potTeams: [],
            "teams": [
              {
                "id": 0,
                "teamName": "俄罗斯",
                "continent": "欧洲",
                "pot": 1,
                "ranking": 65,
                "flagUrl": require("../../assets/nationalFlag/rus.png"),
                "coach": "切尔切索夫",
                "keyPlayers": [
                  {
                    "name": "费尔南德斯",
                    "number": 2,
                    "age": 27,
                    "role": "边后卫",
                    "club": "莫斯科中央陆军",
                    "height": "187",
                    "playerId": 0
                  },
                  {
                    "name": "斯莫洛夫",
                    "number": 20,
                    "age": 27,
                    "role": "前锋",
                    "club": "克拉斯诺达尔",
                    "height": "187",
                    "playerId": 1
                  },
                  {
                    "name": "扎戈耶夫",
                    "number": 10,
                    "age": 27,
                    "role": "中场",
                    "club": "圣彼得堡泽尼特",
                    "height": "179",
                    "playerId": 2
                  },
                  {
                    "name": "阿金费耶夫",
                    "number": 1,
                    "age": 32,
                    "role": "守门员",
                    "club": "莫斯科中央陆军",
                    "height": "186",
                    "playerId": 3
                  },
                  {
                    "name": "戈洛温",
                    "number": 17,
                    "age": 21,
                    "role": "中场",
                    "club": "莫斯科中央陆军",
                    "height": "180",
                    "playerId": 4
                  }
                ]
              },
              {
                "id": 1,
                "teamName": "德国",
                "continent": "欧洲",
                "pot": 1,
                "ranking": 1,
                "flagUrl": require("../../assets/nationalFlag/ger.png"),
                "coach": "勒夫",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "克罗斯",
                    "number": 8,
                    "age": "27",
                    "role": "中场",
                    "club": "皇家马德里",
                    "height": "182"
                  },
                  {
                    "name": "诺伊尔",
                    "number": 1,
                    "age": 31,
                    "role": "守门员",
                    "club": "拜仁慕尼黑",
                    "height": "193",
                    "playerId": 1
                  },
                  {
                    "name": "穆勒",
                    "number": 13,
                    "age": 28,
                    "role": "前锋",
                    "club": "拜仁慕尼黑",
                    "height": "186",
                    "playerId": 2
                  },
                  {
                    "name": "德拉克斯勒",
                    "number": 7,
                    "age": 24,
                    "role": "前锋",
                    "club": "巴黎圣日耳曼",
                    "height": "187",
                    "playerId": 3
                  }
                ]
              },
              {
                "id": 2,
                "teamName": "巴西",
                "continent": "南美洲",
                "pot": 1,
                "ranking": 2,
                "flagUrl": require("../../assets/nationalFlag/bra.png"),
                "coach": "蒂特",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "内马尔",
                    "number": 10,
                    "age": 25,
                    "role": "前锋",
                    "club": "巴黎圣日耳曼"
                  },
                  {
                    "playerId": 1,
                    "name": "保利尼奥",
                    "number": 15,
                    "age": 29,
                    "role": "中场",
                    "club": "巴塞罗那"
                  },
                  {
                    "name": "马塞洛",
                    "number": 12,
                    "age": 29,
                    "role": "后卫",
                    "club": "皇家马德里",
                    "birthDate": "1988-05-12",
                    "height": "174"
                  }
                ]
              },
              {
                "id": 3,
                "teamName": "葡萄牙",
                "continent": "欧洲",
                "pot": 1,
                "ranking": 3,
                "flagUrl": require("../../assets/nationalFlag/por.png"),
                "coach": "费尔南多·桑托斯",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "C·罗纳尔多",
                    "number": 7,
                    "age": 33,
                    "role": "前锋",
                    "club": "皇家马德里"
                  }
                ]
              },
              {
                "id": 4,
                "teamName": "阿根廷",
                "continent": "南美洲",
                "pot": 1,
                "ranking": 4,
                "flagUrl": require("../../assets/nationalFlag/arg.png"),
                "coach": "路易斯.桑保利",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "梅西",
                    "number": 10,
                    "age": 30,
                    "role": "前锋",
                    "club": "巴塞罗那"
                  },
                  {
                    "playerId": 1,
                    "name": "阿圭罗",
                    "number": 9,
                    "age": 29,
                    "role": "前锋",
                    "club": "曼彻斯特城"
                  }
                ]
              },
              {
                "id": 5,
                "teamName": "比利时",
                "continent": "欧洲",
                "pot": 1,
                "ranking": 5,
                "flagUrl": require("../../assets/nationalFlag/bel.png"),
                "coach": "罗伯托.马丁内斯",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "德布劳内",
                    "number": 7,
                    "age": 26,
                    "role": "中场",
                    "club": "曼彻斯特城"
                  },
                  {
                    "playerId": 1,
                    "name": "阿扎尔",
                    "number": 10,
                    "age": 26,
                    "role": "前锋",
                    "club": "切尔西"
                  }
                ]
              },
              {
                "id": 6,
                "teamName": "波兰",
                "continent": "欧洲",
                "pot": 1,
                "ranking": 6,
                "flagUrl": require("../../assets/nationalFlag/pol.png"),
                "coach": "纳瓦卡",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "莱万多夫斯基",
                    "number": 9,
                    "age": 29,
                    "role": "前锋",
                    "club": "拜仁慕尼黑"
                  }
                ]
              },
              {
                "id": 7,
                "teamName": "法国",
                "continent": "欧洲",
                "pot": 1,
                "ranking": 7,
                "flagUrl": require("../../assets/nationalFlag/fra.png"),
                "coach": "德尚",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "格列兹曼",
                    "number": 7,
                    "age": 26,
                    "role": "前锋",
                    "club": "马德里竞技"
                  },
                  {
                    "playerId": 1,
                    "name": "博格巴",
                    "number": 15,
                    "age": 24,
                    "role": "中场",
                    "club": "曼彻斯特联"
                  }
                ]
              },
              {
                "id": 8,
                "teamName": "西班牙",
                "continent": "欧洲",
                "pot": 2,
                "ranking": 8,
                "flagUrl": require("../../assets/nationalFlag/esp.png"),
                "coach": "洛佩特吉",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "伊涅斯塔",
                    "number": 6,
                    "age": 33,
                    "role": "中场",
                    "club": "巴塞罗那"
                  },
                  {
                    "playerId": 1,
                    "name": "拉莫斯",
                    "number": 15,
                    "age": 31,
                    "role": "后卫",
                    "club": "皇家马德里"
                  }
                ]
              },
              {
                "id": 9,
                "teamName": "秘鲁",
                "continent": "南美洲",
                "pot": 2,
                "ranking": 10,
                "flagUrl": require("../../assets/nationalFlag/per.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 10,
                "teamName": "瑞士",
                "continent": "欧洲",
                "pot": 2,
                "ranking": 11,
                "flagUrl": require("../../assets/nationalFlag/sui.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 11,
                "teamName": "英格兰",
                "continent": "欧洲",
                "pot": 2,
                "ranking": 12,
                "flagUrl": require("../../assets/nationalFlag/eng.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 12,
                "teamName": "哥伦比亚",
                "continent": "南美洲",
                "pot": 2,
                "ranking": 13,
                "flagUrl": require("../../assets/nationalFlag/col.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 13,
                "teamName": "墨西哥",
                "continent": "中北美及加勒比海地区",
                "pot": 2,
                "ranking": 16,
                "flagUrl": require("../../assets/nationalFlag/mex.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 14,
                "teamName": "乌拉圭",
                "continent": "南美洲",
                "pot": 2,
                "ranking": 17,
                "flagUrl": require("../../assets/nationalFlag/uru.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 15,
                "teamName": "克罗地亚",
                "continent": "欧洲",
                "pot": 2,
                "ranking": 18,
                "flagUrl": require("../../assets/nationalFlag/cro.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 16,
                "teamName": "丹麦",
                "continent": "欧洲",
                "pot": 3,
                "ranking": 19,
                "flagUrl": require("../../assets/nationalFlag/den.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 17,
                "teamName": "冰岛",
                "continent": "欧洲",
                "pot": 3,
                "ranking": 21,
                "flagUrl": require("../../assets/nationalFlag/isl.png"),
                "coach": "",
                "keyPlayers": []
              },
              {
                "id": 18,
                "teamName": "哥斯达黎加",
                "continent": "中北美及加勒比海地区",
                "pot": 3,
                "ranking": 22,
                "flagUrl": require("../../assets/nationalFlag/crc.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 19,
                "teamName": "瑞典",
                "continent": "欧洲",
                "pot": 3,
                "ranking": 25,
                "flagUrl": require("../../assets/nationalFlag/swe.png"),
                "coach": "",
                "keyPlayers": []
              },
              {
                "id": 20,
                "teamName": "突尼斯",
                "continent": "非洲",
                "pot": 3,
                "ranking": 28,
                "flagUrl": require("../../assets/nationalFlag/tun.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 21,
                "teamName": "埃及",
                "continent": "非洲",
                "pot": 3,
                "ranking": 30,
                "flagUrl": require("../../assets/nationalFlag/egy.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 22,
                "teamName": "塞内加尔",
                "continent": "非洲",
                "pot": 3,
                "ranking": 32,
                "flagUrl": require("../../assets/nationalFlag/sen.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 23,
                "teamName": "伊朗",
                "continent": "亚洲",
                "pot": 3,
                "ranking": 34,
                "flagUrl": require("../../assets/nationalFlag/irn.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 24,
                "teamName": "塞尔维亚",
                "continent": "欧洲",
                "pot": 4,
                "ranking": 38,
                "flagUrl": require("../../assets/nationalFlag/srb.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 25,
                "teamName": "尼日利亚",
                "continent": "非洲",
                "pot": 4,
                "ranking": 41,
                "flagUrl": require("../../assets/nationalFlag/nga.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 26,
                "teamName": "澳大利亚",
                "continent": "亚洲",
                "pot": 4,
                "ranking": 43,
                "flagUrl": require("../../assets/nationalFlag/aus.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 27,
                "teamName": "日本",
                "continent": "亚洲",
                "pot": 4,
                "ranking": 44,
                "flagUrl": require("../../assets/nationalFlag/jpn.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 28,
                "teamName": "摩洛哥",
                "continent": "非洲",
                "pot": 4,
                "ranking": 48,
                "flagUrl": require("../../assets/nationalFlag/mar.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 29,
                "teamName": "巴拿马",
                "continent": "中北美及加勒比海地区",
                "pot": 4,
                "ranking": 49,
                "flagUrl": require("../../assets/nationalFlag/pan.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 30,
                "teamName": "韩国",
                "continent": "亚洲",
                "pot": 4,
                "ranking": 62,
                "flagUrl": require("../../assets/nationalFlag/kor.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              },
              {
                "id": 31,
                "teamName": "沙特阿拉伯",
                "continent": "亚洲",
                "pot": 4,
                "ranking": 63,
                "flagUrl": require("../../assets/nationalFlag/ksa.png"),
                "coach": "",
                "keyPlayers": [
                  {
                    "playerId": 0,
                    "name": "",
                    "number": 10,
                    "age": 10,
                    "role": "",
                    "club": "",
                    "intro": ""
                  }
                ]
              }
            ]
        }
    },


    methods: {
        // 打乱待抽签球队的顺序
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
            for(let i = 0; i < 4; i++) {
                // 获取分档的球队数组
                this.$set(this.potTeams, i, this.teams.slice(i*8, i*8+8));
                //为每支球队设置初始排列顺序
                for(let j = 0; j < 8; j++) {
                    this.$set(this.potTeams[i][j], 'order', j);
                }
            }
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