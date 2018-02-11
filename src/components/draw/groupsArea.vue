<!-- 
    http://localhost:8000/draw
    component: groups-area
-->
<template>
    <div id="groups-area">
        <h1>分组区</h1>
        <!-- 每一档的球队 -->
        <div class="group" v-for="group in groupContainer">
            <!-- 获取小组名 -->
            <h2>{{ group[0].num.slice(0,1) }}</h2>
            <div class="position">
                <ul>
                    <li class="group-pos" v-for="pos in randomSort(group)">
                        <div class="draw-ball">{{ pos.num }}</div>
                        <div class="frame" v-if="pos.isDrew"></div>
                    </li>           
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'groups-area',
    data() {
        return {
            groupContainer: [
                [{num:'A1'},{num:'A2'},{num:'A3'},{num:'A4'}],
                [{num:'B1'},{num:'B2'},{num:'B3'},{num:'B4'}],
                [{num:'C1'},{num:'C2'},{num:'C3'},{num:'C4'}],
                [{num:'D1'},{num:'D2'},{num:'D3'},{num:'D4'}],
                [{num:'E1'},{num:'E2'},{num:'E3'},{num:'E4'}],
                [{num:'F1'},{num:'F2'},{num:'F3'},{num:'F4'}],
                [{num:'G1'},{num:'G2'},{num:'G3'},{num:'G4'}],
                [{num:'H1'},{num:'H2'},{num:'H3'},{num:'H4'}]
            ]
        }
    },
    methods: {
        shuffleGroups() {
            for(let i = 0; i < this.groupContainer.length; i++) {
                this.$set(this.groupContainer, i, this.randomSort(this.groupContainer[i])); 
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
        },
        mounted() {
            for(let i = this.groupContainer.length - 1; i >= 0; i--) {
                for(let j = this.groupContainer[i].length - 1; j >= 0; j--) {
                    this.groupContainer[i][j] = false;
                }
            }
        }
    }
} 
</script>

<style scoped>
#groups-area {
    float: right;
    width: 22%;
}
.group {
    display: inline-block;
    margin: 0 20px 20px 0;
}
.group-pos {
    display: inline-block;
    margin-right: 5px;
    padding: 5px;
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
    background-color: #fff;
}
</style>