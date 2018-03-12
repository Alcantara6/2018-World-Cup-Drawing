
<!-- http://localhost:8000/draw -->
<!--
    程序的复杂性主要在于回避原则和step提醒
    2-17 
        1.打乱签的顺序，使用v-move过渡；2.使用props和$emit传递状态，暂不用bus和vuex 
    2-21 
        groupContainer创建JSON文件，把选中的Object{team}加入，
        确认抽签结果传入JSON,json server不能用post
    2.22 
        1. 更改流程，先抽队，再确定小组，以显示回避原则，用计算属性表示正常顺序的小组落位，以此为基础得到实际的小组落位
        2. 因为回避原则，设置当前分档时不能根据是否为第8组判断，curPot放在计算属性
        : groupContainer先用空数组，就可用length判断，否则每次要查询team属性
        3. TODO: 组件、方法复用，函数封装，例如如何复用回避原则的方法
        4. TODO: 避免某一档剩最后几只球队时无法满足回避原则
    2.23 
        根据欧洲、非欧洲条件判断进行回避算法，覆盖所有球队的回避情况，
        step内容用一个方法封装，代码简化20%以上
        TODO: 用mixin混入通用方法 
    3.2
        优化页面样式，分区块
        增加多个逻辑，在不同阶段对应元素显示高亮样式
    3.5 增加draw-dialog组件作为应用进入界面和抽签球队确认落位时的弹窗
    3.5 优化状态按钮样式，使用iconfont
-->

<template>  
    <div id="draw">
        <!-- 欢迎对话框 -->
        <draw-dialog :isShow="isShowDialog" v-if="curRound === 0" @next="gotoNext">
            <img class="dialog-logo" slot="image" src="../assets/WorldCupLogo.jpg">
            <p slot="text">欢迎来到俄罗斯世界杯抽签仪式现场</p>
            <span slot="buttonTxt">开始抽签</span>
        </draw-dialog>
        <!-- 抽中球队确认落位对话框 -->
        <draw-dialog :isShow="isShowDialog" v-if="curRound > 0" @next="gotoNext">
            <img class="dialog-team" slot="image" :src="curTeam.flagUrl">
            <p slot="text">{{ curTeam.teamName }} - {{ curPos }}</p>
            <span slot="buttonTxt">确认落位</span>
        </draw-dialog>

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
                    :curPot="curPot"
                    :groupContainer="groupContainer"
                    :curTeamName="curTeam.teamName">
                </draw-show>
            </aside>   
        </section>
        <!-- id="main"结束 -->
        
        <!--分组结果展示 -->
        <section class="result">
            <grouping-result 
                :groupContainer="groupContainer"
                :curGroupNum="curGroupNum">
            </grouping-result>
        </section>

        <!-- 提示标签 -->
        <footer id="draw-notice">
            <!-- 进行状态标签 -->
            <div id="status">
                <!-- 抽签之前点击开始 -->
                <button class="statusBtn" v-if="curRound === 0" @click.once="start">
                    START
                </button>
                <!-- 抽签完成确认结果 -->
                <button class="statusBtn" v-else-if="curRound === -1">
                    抽签完成
                </button>       
                <div class="statusBtn" v-else @click="return false">
                    <span>抽签进行中…………</span>
                    <!-- 显示当前状态信息 -->
                    <span v-if="curPot > 0">
                        当前第<strong>{{ curPot }}</strong>档，
                        从<strong>{{ orderGroupName }}</strong>组开始落位
                    </span>
                </div>
            </div>
            <!-- 操作步骤提示 -->
            <div class="step" v-if="curRound >= 0">
                <i class="iconfont icon-pointer-right"></i>
                {{ step }}
            </div>
        </footer>
    </div>
</template>

<script>
import Qs from 'qs';
import teamArea from './draw/teamArea';
import groupArea from './draw/groupArea';
import groupingResult from './draw/groupingResult';
import drawShow from './draw/drawShow';
import drawDialog from './draw/drawDialog';
export default {
    name: 'draw',
    components: {
        teamArea,
        groupArea,
        groupingResult,
        drawShow,
        drawDialog
    },
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
                "keyPlayers": []
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
            ],
            // groupContainer从JSON引入（因空数组不好渲染DOM），因此不能通过length区别，增加team属性，通过包含team属性的情况进行判定
            "groups": [
              {
                "id": 0,
                "groupChar": "A",
                "posNum": 1
              },
              {
                "id": 1,
                "groupChar": "A",
                "posNum": 2
              },
              {
                "id": 2,
                "groupChar": "A",
                "posNum": 3
              },
              {
                "id": 3,
                "groupChar": "A",
                "posNum": 4
              },
              {
                "id": 4,
                "groupChar": "B",
                "posNum": 1
              },
              {
                "id": 5,
                "groupChar": "B",
                "posNum": 2
              },
              {
                "id": 6,
                "groupChar": "B",
                "posNum": 3
              },
              {
                "id": 7,
                "groupChar": "B",
                "posNum": 4
              },
              {
                "id": 8,
                "groupChar": "C",
                "posNum": 1
              },
              {
                "id": 9,
                "groupChar": "C",
                "posNum": 2
              },
              {
                "id": 10,
                "groupChar": "C",
                "posNum": 3
              },
              {
                "id": 11,
                "groupChar": "C",
                "posNum": 4
              },
              {
                "id": 12,
                "groupChar": "D",
                "posNum": 1
              },
              {
                "id": 13,
                "groupChar": "D",
                "posNum": 2
              },
              {
                "id": 14,
                "groupChar": "D",
                "posNum": 3
              },
              {
                "id": 15,
                "groupChar": "D",
                "posNum": 4
              },
              {
                "id": 16,
                "groupChar": "E",
                "posNum": 1
              },
              {
                "id": 17,
                "groupChar": "E",
                "posNum": 2
              },
              {
                "id": 18,
                "groupChar": "E",
                "posNum": 3
              },
              {
                "id": 19,
                "groupChar": "E",
                "posNum": 4
              },
              {
                "id": 20,
                "groupChar": "F",
                "posNum": 1
              },
              {
                "id": 21,
                "groupChar": "F",
                "posNum": 2
              },
              {
                "id": 22,
                "groupChar": "F",
                "posNum": 3
              },
              {
                "id": 23,
                "groupChar": "F",
                "posNum": 4
              },
              {
                "id": 24,
                "groupChar": "G",
                "posNum": 1
              },
              {
                "id": 25,
                "groupChar": "G",
                "posNum": 2
              },
              {
                "id": 26,
                "groupChar": "G",
                "posNum": 3
              },
              {
                "id": 27,
                "groupChar": "G",
                "posNum": 4
              },
              {
                "id": 28,
                "groupChar": "H",
                "posNum": 1
              },
              {
                "id": 29,
                "groupChar": "H",
                "posNum": 2
              },
              {
                "id": 30,
                "groupChar": "H",
                "posNum": 3
              },
              {
                "id": 31,
                "groupChar": "H",
                "posNum": 4
              }
            ],
            curRound: 0,    // 1-32轮  抽取球队之前
            curGroupNum: 0, // 1-8组   抽取球队之后，抽取位次之前
            curTeam: {},    // 抽中的球队
            curPos: '',     // 抽中的位次。1-4位。如'A1','A2','A3','A4'
            step: '请点击左下角start开始抽签，并根据提示流程操作',
            drawTeamFlag: false,
            drawPosFlag: false,
            isShowDialog: true
        }
    },


    computed: {
        groupContainer() {
            let cont = [];
            for(let i = 0; i < 8; i ++) {
                cont[i] = this.groups.slice(i*4,i*4+4);
            }
            return cont;
        },
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
        gotoNext() {
            if(this.curRound === 0) {
                this.isShowDialog = false;
            }
            else if(this.curRound > 0) {
                this.isShowDialog = false;
                this.enterGroup();
            }
        },

        // 开始抽签
        start() {
            for(let i = 0; i < 4; i++) {
                this.$refs.r1.shuffleOrder(i);
            }            
            for(let i = 0; i < 8; i++) {
                this.$refs.r2.shuffleGroup(i);
            }
            this.curRound = 1;
            this.step = "请从第一档红色小球抽取东道主俄罗斯队";
            this.drawTeamFlag = true;
            this.isShowDialog = false;
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
                this.step = `
                    ${this.curTeam.teamName}队进入${this.curGroupName}组，
                    请在${this.curGroupName}组抽取位置`;
            }
            else if(team.continent !== "欧洲"){
                this.step = `
                    同一小组不能有相同大洲的球队（欧洲除外），
                    ${this.curTeam.teamName}队顺延进入${this.curGroupName}组。
                    请在${this.curGroupName}组抽取位置`;
            }
            else {
                this.step = `
                    同大洲不能有两支以上欧洲球队，
                    ${this.curTeam.teamName}队顺延进入${this.curGroupName}组。
                    请在${this.curGroupName}组抽取位置`;
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
            this.step = `
                ${this.curTeam.teamName}队进入${this.curPos}位`;
            this.drawPosFlag = false;
            this.isShowDialog = true;
        },

        // 将抽取的球队落位至小组
        // 过程中不用将结果传入后端
        enterGroup() {
            let position = this.curPos.slice(1);
            // 将抽取到的球队落入抽取到的小组位次
            this.$set(this.groupContainer[this.curGroupNum - 1][position - 1], 'team', this.curTeam);
            // 最后一轮之前，确认球队落位后，轮次增加1
            if(this.curRound < 32) {
                this.curRound ++;
            } else {
                // 最后一支球队落位后，将轮次赋值为-1
                this.curRound = -1;
            }
            this.step = `请从第${this.curPot}档抽取一支球队`;
            this.drawTeamFlag = true;
        }
    },


    mounted() {
        this.$nextTick(function () {
            this.isShowDialog = true;
        });
    }
} 
</script>

<style scoped>
/*总体布局*/
#draw {
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
    flex: 0 0 200px;
    order: -1;
}

/* live */
#team-area {
    flex: 55%;
}
#group-area {
    flex: 45%;
}

/*#notice*/
#draw-notice {
    width: 100%;     /*绝对定位后，宽度等于内容实际宽度*/
    padding: 5px 0;
    border-top: 2px solid #0020c2;
    text-align: center;
}
#status {
    /* 如果float: left, .step作为inline-block, 按避开float其之后的宽度居中*/
    position: absolute;
    left: 0;
    margin-left: 10px;
}
.statusBtn,
.step {
    border: 1px solid #000;
    line-height: 30px;
}
/*进行状态按钮*/
.statusBtn {
    min-width: 150px;    /*用min-width，有较长文字出现的情况*/
    padding: 0 20px;
    height: 30px;
    background: #f0f8ff;
    border-radius: 8px;
    font-family: 'Hiragino GB';
    font-weight: 700;
    outline-width: 0;
}
button.statusBtn:hover {
    background: #e67451;
    color: #fff;
}
/*操作流程提示*/
.step {
    display: inline-block;
    min-width: 280px;   /*用min-width，有较长文字出现的情况*/
    min-height: 30px;
    padding: 0 20px;
    background: #ccfb5d;
    font-size: 16px;
    font-weight: 700;
    align-self: center;
}

/*从父组件drawPage.vue向drawDialog.vue分发的图片*/
.dialog-logo {
    width: 150px;
}
.dialog-team {
    width: 100px;
    border: 1px solid #000;
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