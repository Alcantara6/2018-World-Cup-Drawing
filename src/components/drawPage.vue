<!-- 
    http://localhost:8000/draw
-->
<template>
    <div id="draw">
        <seading-area :teams="teamList" :toStart="start" ref="dr1"></seading-area>
        <groups-area ref="dr2"></groups-area>
        <grouping-result></grouping-result>
        <draw-show :teams="teamList"></draw-show>
        <!-- 开始抽签：用了.once修饰符,目前无法做到不停切换随机排列 -->
        <button class="start-draw" type="button" @click.once="startDraw">start-draw</button>
    </div>
</template>

<script>
import seadingArea from './draw/seadingArea';
import groupsArea from './draw/groupsArea';
import groupingResult from './draw/groupingResult';
import drawShow from './draw/drawShow';
export default {
    name: 'teams',
    components: {
        seadingArea,
        groupsArea,
        groupingResult,
        drawShow
    },
    data() {
        return {
            teamList: [],
            start: false
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.fetchTeams();
        });
    },
    methods: {
        fetchTeams() {
            this.$axios.get("http://localhost:3000/teams")
            .then(res => {
              this.teamList = res.data;
            })
            .catch(error => {
              console.log(error);
            });    
        },
        startDraw() {
            // 不能用事件更改计算属性中的数据达到实时渲染的效果，用flag控制计算属性的返回值
            this.start = !this.start;
            // 用事件更改渲染data中的数据
            this.$refs.dr2.shuffleGroups();
        }
    }
} 
</script>

<style scoped>
#draw {
    min-width: 320px;
    overflow: hidden;
}
.start-draw {
    font-size: 24px;
    position: absolute;
    top: 0;
    left: 50%;
}
</style>