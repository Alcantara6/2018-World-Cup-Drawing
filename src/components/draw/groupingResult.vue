
<!-- 
    http://localhost:8000/draw
    component: grouping-result
-->
<!-- 如何使用非响应式数据？定义局部变量，使其等于data（props）中的数据，例如需要分组落位的球队 -->
<template>
    <div id="grouping-result">
        <h3>分组结果</h3>
        <!-- 每一档的球队 -->
        <div class="grouping" v-for="group in groupContainer">
            <h2>{{ group[0].groupChar }}</h2>
            <div class="position">
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
#grouping-result>button {
    display: block;
    margin: 0 auto;
}
.grouping {
    display: inline-block;
    /* inline元素默认是baseline对齐，一个 inline-block 如果其中有内容，
    其baseline 就是最后一行文字的baseline，否则就是其margin下边缘。 */
    vertical-align: top;
    width: 100px;
    margin: 25px 20px 20px 0;
    border: 2px solid #000;
}
.grouping-idx {
    height: 20px;
    margin-bottom: 2px;
    border-bottom: 1px dashed #ccc;
}
button {
    width: 80px;
    height: 40px;
}
</style>