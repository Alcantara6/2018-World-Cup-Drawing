
<!-- 
    http://localhost:8000/draw
    component: groups-area
-->
<template>
    <div id="group-region">
        <h1>分组区</h1>
        <!-- 每一档的球队 -->
        <div class="group" v-for="(group,gIndex) in positionContainer">
            <!-- 获取小组名 -->
            <h2>{{ group[0].num.slice(0,1) }}组</h2>
            <button 
            class="shuffleBtn" 
            type="button" 
            @click="shuffleGroup(gIndex)">
            shuffle the groups
            </button>
            <div class="position">
                <transition-group tag="ul" name="flip-list">
                    <li class="group-pos" v-for="(pos,pIndex) in group" :key="pos.num">
                        <div class="draw-ball">{{ pos.num }}</div>
                        <div :class="
                            ['frame',{'default-frame':pos.num.slice(1) == 1}]" 
                            v-show="!pos.isDrew" 
                            @click="choosePos(pos,pIndex,group,gIndex)">
                        </div>
                    </li>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'group-region',
    props: {
        curPot: Number,
        curGroup: Number,
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
            return String.fromCharCode(this.curGroup+64);
        }
    },
    methods: {
        choosePos(pos,pIndex,group,gIndex) {
            // 抽取球队
            if(!this.drawPosFlag) {
                alert('该流程不能抽取小组位置');
                return false;
            }
            // 须在当前小组选择
            if(gIndex !== this.curGroup - 1) {
                alert(`请在${this.groupName}组选择`);
                return false;
            }
            // 第一档球队默认第一顺位
            if(this.curPot === 1) {
                if(pos.num.slice(1) != 1) {
                    alert("选择红色小球-第一档球队默认进入第一顺位");
                    return false;
                }
            }
            pos.isDrew = true;
            this.$emit('choose',pos);
        },
        shuffleGroup(idx) {
            // TODO: setInterval自动多次打乱            
            this.$set(this.positionContainer, idx, this.randomSort(this.positionContainer[idx])); 
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
#group-region {
    float: right;
    width: 25%;
}
.group {
    display: inline-block;
    margin: 0 20px 20px 0;
}
.group-pos {
    display: inline-block;
    position: relative;
    margin-right: 5px;
    padding: 5px;
    border: 1px solid #0020c2;
}
.draw-ball {
    border: 1px solid #0020c2;
    border-radius: 30%;
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