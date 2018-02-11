<!-- 
    http://localhost:8000/draw
    component: seading-area
-->
<template>
    <div id="seading-area">
        <h1>分档区</h1>
        <!-- 每一档的球队 -->
        <div class="individual-seading" v-for="seading in shuffleTeams">
            <h2 v-if="seading.length">第{{seading[0].seading}}档：</h2>
            <ul>
                <!-- 每一档的每只球队，随机排列 -->
                <li class="team" v-for="team in seading" :key="team.id">
                    <img :src="team.flagUrl">
                    <div>{{ team.teamName }}</div>
                    <div class="frame" v-show="team.isDrew"></div> 
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'seading-area',
    // 因为计算属性作怪，通过父组件传入大洲球队呢？
    // 1. 不能直接去更改，要赋值给data中的局部变量；2. 引用类型目前看来赋值不了
    // 最终，把大洲球队你放在计算属性
    // 用boolean控制启停
    props: {
        teams: [Array],
        toStart: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        seadingTeams() {
            return  [
                        this.teams.filter(item => 
                            item.seading === 1
                        ),
                        this.teams.filter(item => 
                            item.seading === 2
                        ),
                        this.teams.filter(item => 
                            item.seading === 3
                        ),
                        this.teams.filter(item => 
                            item.seading === 4
                        )
                    ]
        },
        // 计算属性，它定义什么，就返回什么，且具有最高的响应优先级，其它方法对它的更改都无效。
        // 计算属性是响应式的，method只能渲染一次？
        shuffleTeams() {
            if(!this.toStart) {
                return this.seadingTeams;
            }
            else {
                return this.shuffle();
            }
        }
    },
    methods: {
        // XXX: 因为不能直接使用data中的数据作为原始数据并用methods来遍历得到返回值，必须要使用计算属性，但是计算属性的响应优先级最高，始终是以它自己的表示式为准，不要另外用方法去改变计算属性，无效！
        // XXX: 计算属性在页面刚开始加载时会响应一次（就好比表单验证）
        // 每次点击运行函数，得到返回值重新渲染？不行，只能$set实例中的变量才能实时渲染
        // 渲染data中的数据？如果初始无数据，在页面首次加载时始终无法渲染。
        shuffle() {
            let result = [];
            for(let i = 0; i < this.seadingTeams.length; i++) {
                result[i] = this.randomSort(this.seadingTeams[i]); 
            }
            return result;
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
#seading-area {
    float: left;
}
.team {
    display: inline-block;
    width: 60px;
    margin-right: 2px;
    border: 2px solid #0020c2;
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
    background-color: #fff;
}
</style>