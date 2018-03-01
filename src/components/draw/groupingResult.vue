
<!-- 
    http://localhost:8000/draw
    component: grouping-result
-->
<!-- 如何使用非响应式数据？定义局部变量，使其等于data（props）中的数据，例如需要分组落位的球队 -->
<template>
    <div id="grouping-result">
        <h2>分组结果</h2>
        <!-- 每一档的球队 -->
        <div class="grouping" v-for="group in groupContainer">
            <h2>{{ group[0].groupChar }}</h2>
            <div class="grouping-box">
                <ul>
                    <li class="grouping-idx" v-for="pos in group">
                        <span v-if="pos.team">{{ pos.team.teamName }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'grouping-result',
    props: {
        groupContainer: Array
    }
}
</script>

<style scoped>
#grouping-result {
    text-align: center;
}
#grouping-result>h2 {
    margin-bottom: 10px;
    font-size: 20px;
    color: #3090c7;
    font-weight: 700;
    border-bottom: 1px solid #ccc;
}
.grouping {
    display: inline-block;
    vertical-align: top;
    width: 100px;
    margin: 0px 20px 20px 0;
    border: 2px solid #000;
}
.grouping-idx {
    height: 20px;
    margin-bottom: 2px;
    border-bottom: 1px dashed #ccc;
}
</style>