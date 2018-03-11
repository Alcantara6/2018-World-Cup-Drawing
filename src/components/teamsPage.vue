<!-- 
    http://localhost:8000/teams
-->
<!-- 3-7 每次添加或删除球员数据后,用beforeRouteUpdate从后台获取更新后的数据 -->

<template>
	<div class="teams-overview">
        <header><h1>2018年世界杯32强阅兵</h1></header>
        
        <section id="teams-wrap">
            <h2 class="teams-title">各大洲晋级决赛圈球队</h2>
            <!-- 显示各个大洲球队 -->
            <div class="continent" v-for="teams in continentTeams">
                <!-- 不使用v-if会报错 Cannot read property 'continent' of undefined -->
                <h2 v-if="teams.length">{{ teams[0].continent }} （{{ teams.length }}支）</h2>
                <ul>
                    <li class="team" v-for="team in teams">
                        <!-- 跳转到某只球队，由于是32支球队各一个路由，所以不用v-for的index -->
                        <router-link :to="'/teams/teamTable/' + team.id">
                            <img :src="team.flagUrl">
                        </router-link>
                        <router-link :to="'/teams/teamTable/' + team.id">
                            {{ team.teamName }}({{ team.pot }})
                        </router-link>   
                    </li>
                </ul>
            </div>
        </section>

        <section id="players-wrap">
            <h2 class="players-title">关键球员数据<span>点击球队标志查看、编辑各队关键球员</span></h2>
            <!-- 因为有更新数据，不能添加keep-alive,跳转到该路由后不能执行mounted中的内容(从后台获取更新后的数据),如果执行activated中的呢？ -->
            <!-- <keep-alive> -->
            <router-view tag="div" :teams="teamList" @add="addNewPlayer" @edit="updatePlayer" @delete="deletePlayer"></router-view>
            <!-- </keep-alive> -->
        </section> 
	</div>
</template>

<script>
export default {
	name: 'teams',
	data() {
		return {
            "teamList": [
              {
                "id": 0,
                "teamName": "俄罗斯",
                "continent": "欧洲",
                "pot": 1,
                "ranking": 65,
                "flagUrl": require("../assets/nationalFlag/rus.png"),
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
                "flagUrl": require("../assets/nationalFlag/ger.png"),
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
                "flagUrl": require("../assets/nationalFlag/bra.png"),
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
                "flagUrl": require("../assets/nationalFlag/por.png"),
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
                "flagUrl": require("../assets/nationalFlag/arg.png"),
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
                "flagUrl": require("../assets/nationalFlag/bel.png"),
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
                "flagUrl": require("../assets/nationalFlag/pol.png"),
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
                "flagUrl": require("../assets/nationalFlag/fra.png"),
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
                "flagUrl": require("../assets/nationalFlag/esp.png"),
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
                "flagUrl": require("../assets/nationalFlag/per.png"),
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
                "flagUrl": require("../assets/nationalFlag/sui.png"),
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
                "flagUrl": require("../assets/nationalFlag/eng.png"),
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
                "flagUrl": require("../assets/nationalFlag/col.png"),
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
                "flagUrl": require("../assets/nationalFlag/mex.png"),
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
                "flagUrl": require("../assets/nationalFlag/uru.png"),
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
                "flagUrl": require("../assets/nationalFlag/cro.png"),
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
                "flagUrl": require("../assets/nationalFlag/den.png"),
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
                "flagUrl": require("../assets/nationalFlag/isl.png"),
                "coach": "",
                "keyPlayers": []
              },
              {
                "id": 18,
                "teamName": "哥斯达黎加",
                "continent": "中北美及加勒比海地区",
                "pot": 3,
                "ranking": 22,
                "flagUrl": require("../assets/nationalFlag/crc.png"),
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
                "flagUrl": require("../assets/nationalFlag/swe.png"),
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
                "id": 20,
                "teamName": "突尼斯",
                "continent": "非洲",
                "pot": 3,
                "ranking": 28,
                "flagUrl": require("../assets/nationalFlag/tun.png"),
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
                "flagUrl": require("../assets/nationalFlag/egy.png"),
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
                "flagUrl": require("../assets/nationalFlag/sen.png"),
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
                "flagUrl": require("../assets/nationalFlag/irn.png"),
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
                "flagUrl": require("../assets/nationalFlag/srb.png"),
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
                "flagUrl": require("../assets/nationalFlag/nga.png"),
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
                "flagUrl": require("../assets/nationalFlag/aus.png"),
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
                "flagUrl": require("../assets/nationalFlag/jpn.png"),
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
                "flagUrl": require("../assets/nationalFlag/mar.png"),
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
                "flagUrl": require("../assets/nationalFlag/pan.png"),
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
                "flagUrl": require("../assets/nationalFlag/kor.png"),
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
                "flagUrl": require("../assets/nationalFlag/ksa.png"),
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
    computed: {	
        continentTeams() {
            return [
                this.teamList.filter(item => 
                    item.continent === '欧洲'
                ),
                this.teamList.filter(item => 
                    item.continent === '南美洲'
                ),
                this.teamList.filter(item => 
                    item.continent === '中北美及加勒比海地区'
                ),
                this.teamList.filter(item => 
                    item.continent === '非洲'
                ),
                this.teamList.filter(item => 
                    item.continent === '亚洲'
                )
            ]
		}
	},
    methods: {
        addNewPlayer(params) {
            this.$set(this.teamList, params.id, params.team);
            this.$router.push({
                path: '/teams/teamTable/' + params.id,
                query: {alert: '球员信息添加成功'}
            });   
        },
        updatePlayer(params) {
            this.$set(this.teamList, params.id, params.team);
            this.$router.push({
                path: '/teams/teamTable/' + params.id,
                query: {alert: '球员信息修改成功'}
            }); 
        },
        deletePlayer(params) {
            this.$set(this.teamList, params.id, params.team);
            this.$router.push({
                path: '/teams/teamTable/' + params.id,
                query: {alert: '球员确认离队'}
            });   
        }
    },
    mounted() {
    }
} 
</script>

<style scoped>
/*共用*/
.teams-title,
.players-title {    
    margin-bottom: 20px;
    text-align: center;
    color: #9f000f;
    border-bottom: 1px solid #9f000f;
}
.players-title span {
    padding: 0 10px;
    font-size: 14px;
    font-weight: 400;
    color: #000;
}
/*标题*/
header {
    position: relative;
    text-align: center;
    margin-bottom: 20px;
}
header>h1 {
    position: relative;
    display: inline;
    padding: 0 1em;
    background: #fff;
    z-index: 9;
}
header:after {        /*使用伪类添加横杠修饰*/
    content: '';
    width: 100%;
    height: 0;
    position: absolute;
    top: 50%;
    left: 0;
    border: .5px solid #ccc;
}
/*左侧区域*/
#teams-wrap {
    width: 45%;
    float: left;
}
.continent {
    margin-bottom: 5px;
}
.continent>h2 {
    font: 16px/2 'Hiragino GB' bold;
}
.team {
    margin: 0 10px 5px 0;
    display: inline-block;
}
.team a {
    display: block;
    text-align: center;
    color: #000;
}
.team img {
    border: 1px solid #000;
}

/*右侧区域*/
#players-wrap {
    margin: 0 0 10px 50%;
}
</style>