
<!-- 
    http://localhost:8000/draw
    component: grouping-result
-->
<!-- 如何使用非响应式数据？定义局部变量，使其等于data（props）中的数据，例如需要分组落位的球队 -->
<!-- 3.2 优化样式 -->

<template>
    <div id="grouping-result">
        <div class='logo'>
            <img src="../../assets/Worldcup logo.jpg" alt="俄罗斯世界杯抽签仪式">
        </div>
        <div class="main">
            <h2>分组结果</h2>
            <!-- 每一档的球队 -->
            <div :class="['group', {'current-group': gIndex === curGroupNum - 1}]" v-for="(group,gIndex) in groupContainer">
                <h3>{{ group[0].groupChar }}</h3>
                <div class="group-box">
                    <ul>
                        <li class="group-idx" v-for="pos in group">
                            <span v-if="pos.team">{{ pos.team.teamName }}</span>
                        </li>
                    </ul>
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
    flex: 0 0 15%;
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
    margin: 5px 20px 0 0;
    border: 2px solid #483c32;
    background: #fff;
}
.group h3 {
    background-color: #e55451;
}
.current-group {
    background-color: #e55451;
}

/*每个位次*/
.group-idx {
    height: 20px;
    margin-bottom: 2px;
    border-bottom: 1px dashed #ccc;
}
</style>