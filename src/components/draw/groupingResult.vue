
<!-- 
    http://localhost:8000/draw
    component: grouping-result
-->
<!-- 3.2 优化样式 
     当前落位的小组高亮，层叠上下文和z-index的运用
-->

<template>
    <div id="grouping-result">
        <div class='logo'>
            <img src="../../assets/WorldCupLogo.jpg" alt="俄罗斯世界杯抽签仪式">
        </div>
        <div class="main">
            <h2>分组结果</h2>
            <!-- 每一档的球队 -->
            <div class="group" v-for="(group,gIndex) in groupContainer">
                <h3>{{ group[0].groupChar }}</h3>
                <div class="group-teams">    
                    <ul>
                        <li class="group-idx" v-for="pos in group" :key="pos.id">
                            <img v-if="pos.team" :src="pos.team.flagUrl">
                            <span v-if="pos.team">{{ pos.team.teamName }}</span>
                        </li>
                    </ul>
                    <transition name="frame">
                        <div class="frame" v-if="gIndex === curGroupNum - 1"></div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'grouping-result',
    props: {
        groupContainer: Array,
        curGroupNum: Number
    }
}
</script>

<style scoped>
#grouping-result {
    display: flex;
    text-align: center;
}
.logo {
    flex: 0 0 200px;
    border-right: 3px solid #ede275;
    box-sizing: border-box;  /*图片宽度与父容器相等*/
}
.logo img {
    width: 100%;
}

/*分组部分*/
.main {
    flex: 1;
    background: #5471b0;
}
.main>h2 {
    margin-bottom: 5px;
    padding-top: 5px;
    font-size: 20px;
    color: #fff;
    font-weight: 700;
    border-bottom: 1px dashed #ccc;
}

/*每个小组*/
.group {
    display: inline-block;
    vertical-align: top;
    width: 100px;
    margin: 0px 20px 5px 0;
    border: 2px solid #483c32;
    background: #fff;
}
.group h3 {
    background-color: #e55451;
}
.group-teams {
    position: relative;
}
/*每个位次*/
.group-idx {
    height: 20px;
    padding: 3px 0 3px 5px;
    border-bottom: 1px dashed #ccc;
    /*每个位次球队显示需要设置positon：relative和index最上，用于高亮scale()过渡*/
    position: relative;
    z-index: 99;
    text-align: left;
}
.group-idx img {
    height: 100%;
}

/*当前落位的小组高亮*/
.frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffebcd;
    transform-origin: center 0;
    z-index: 0;
}
.frame-enter {
    transform: scaleY(0);
}
.frame-leave-to {
    opacity: 0;
}
.frame-enter-active,
.frame-leave-active {
    transition: all .5s;
}
</style>