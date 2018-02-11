<!-- 
    http://localhost:8000/draw
    component: groups-area
-->
<template>
    <div id="grouping-result">
        <h1>分组结果</h1>
        <!-- 每一档的球队 -->
        <div class="grouping" v-for="group in groupContainer">
            <!-- 获取小组名 -->
            <h2>{{ group[0].num.slice(0,1) }}</h2>
            <div class="position">
                <ul>
                    <li class="grouping-idx" v-for="pos in group"></li>        
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'grouping-result',
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
    }
} 
</script>

<style scoped>
#grouping-result {
    width: 800px;
    margin: 0 auto;
    text-align: center;
}
.grouping {
    display: inline-block;
    width: 100px;
    margin: 25px 20px 20px 0;
    border: 2px solid #000;
}
.grouping-idx {
    height: 20px;
    margin-bottom: 2px;
    border-bottom: 1px dashed #ccc;
}
</style>