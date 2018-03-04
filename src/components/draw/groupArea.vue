
<!-- 
    http://localhost:8000/draw
    component: groups-area
-->
<template>
    <div id="group-area">
        <h2>分组区</h2>
        <div class="groups">
            <!-- 每一档的球队 -->
            <div 
                :class="['group', {'current-group': gIndex == curGroupNum - 1}]" 
                v-for="(group,gIndex) in positionContainer">
                <!-- 获取小组名 -->
                <h2>{{ group[0].num.slice(0,1) }}组</h2>
                <button 
                    :class="['shuffleBtn', {'current-group-shuffle': gIndex == curGroupNum - 1 && drawPosFlag}]" 
                    @click="shuffleGroup(gIndex)">
                    shuffle
                </button>
                <div class="position">
                    <transition-group class="pos-box" tag="ul" name="flip-list">
                        <li class="pos" v-for="(pos,pIndex) in group" :key="pos.num">
                            <div>{{ pos.num }}</div>
                            <transition> 
                                <div name="frame" 
                                    :class="['frame',{'default-frame':pos.num.slice(1) == 1}]"
                                    v-if="!pos.isDrew"
                                    @click="choosePos(pos,pIndex,group,gIndex)">
                                </div>
                            </transition>
                        </li>
                    </transition-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'group-area',
    props: {
        curPot: Number,
        curGroupNum: Number,
        drawPosFlag: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            positionContainer: [
                [{num:'A1',isDrew:false},{num:'A2',isDrew:false},{num:'A3',isDrew:false},{num:'A4',isDrew:false}],
                [{num:'B1',isDrew:false},{num:'B2',isDrew:false},{num:'B3',isDrew:false},{num:'B4',isDrew:false}],
                [{num:'C1',isDrew:false},{num:'C2',isDrew:false},{num:'C3',isDrew:false},{num:'C4',isDrew:false}],
                [{num:'D1',isDrew:false},{num:'D2',isDrew:false},{num:'D3',isDrew:false},{num:'D4',isDrew:false}],
                [{num:'E1',isDrew:false},{num:'E2',isDrew:false},{num:'E3',isDrew:false},{num:'E4',isDrew:false}],
                [{num:'F1',isDrew:false},{num:'F2',isDrew:false},{num:'F3',isDrew:false},{num:'F4',isDrew:false}],
                [{num:'G1',isDrew:false},{num:'G2',isDrew:false},{num:'G3',isDrew:false},{num:'G4',isDrew:false}],
                [{num:'H1',isDrew:false},{num:'H2',isDrew:false},{num:'H3',isDrew:false},{num:'H4',isDrew:false}]
            ]
        }
    },
    computed: {
        // 小组序号转换为小组名: fromCharCode
        groupName() {
            return String.fromCharCode(this.curGroupNum+64);
        }
    },
    methods: {
        choosePos(pos,pIndex,group,gIndex) {
            // 抽取球队
            if(!this.curGroupNum) {
                alert('请点击start开始');
            }
            else {
                switch(true) {
                    case !this.drawPosFlag:
                        alert('该流程不能抽选球队');
                        break;

                    // 须在当前小组选择
                    case gIndex !== this.curGroupNum - 1:
                        alert(`请在${this.groupName}组选择`);
                        break;

                    //第一支必须抽东道主俄罗斯 
                    case this.curPot === 1 && pos.num.slice(1) != 1:
                        alert("选择红色小球-第一档球队默认进入第一位次");
                        break;

                    default:
                        pos.isDrew = true;
                        this.$emit('choose',pos);
                        break;
                }
            }
        },

        shuffleGroup(idx) {
            // TODO: setInterval自动多次打乱            
            if(!this.curGroupNum || idx === this.curGroupNum - 1) {
                this.$set(this.positionContainer, idx, 
                        this.randomSort(this.positionContainer[idx]));
            }
        },

        // 随机排列数组项
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
    }
} 
</script>

<style scoped>
#group-area>h2 {
    margin-bottom: 10px;
    font-size: 20px;
    color: #3090c7;
    font-weight: 700;
    border-bottom: 1px solid #ccc;
}
.groups {
    display: flex;
    flex-wrap: wrap;
}
.group {
    flex: 0 0 40%;
    margin: 0 30px 30px 0;
    padding: 5px;
    position: relative;
    border: 1px solid #0020c2;
    transition: background-color .5s; /* 切换当前小组的过渡*/
}
.current-group {
    background-color: #ffebcd;
}

.shuffleBtn {
    width: 50px;
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 3px;
    background-color: #306eff;
    border: none;
    color: #fff;
    outline-width: 0;
}
.current-group-shuffle:hover {
    background-color: #4e8cff;
    cursor: pointer;  /*可选时的光标*/
}

.pos-box {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
}
.pos {
    flex: none;
    width: 30px;
    height: 30px;
    position: relative;
    border: 1px solid #0020c2;
    background: #fff;
    text-align: center;
    font: 14px/30px 'Arial';
    font-weight: 700;
}
/*key*/
.frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #e3e4fa;
    cursor: pointer;
}
.default-frame {
    background-color: #f70d1a;
}
.frame-enter,
.frame-leave-to {
    opacity: 0;
}
.frame-enter-active,
.frame-leave-active {
    transition: all 2s;
}
.flip-list-move {
    transition: all .5s;
}
</style>