<!-- 
    http://localhost:8000/draw
    component: draw-show
-->
<template>
    <div id="draw-show">
        <div class="individual-seading" v-for="seading in seadingTeams">
            <h2 v-if="seading.length">第{{seading[0].seading}}档：</h2>
            <ul>
                <!-- 每一档的每只球队，随机排列 -->
                <li class="team" v-for="team in seading" :key="team.id">
                    <img :src="team.flagUrl">
                    <div>{{ team.teamName }}</div> 
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'seading-area',
    props: {
        teams: [Array]
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
        }
    }
} 
</script>

<style scoped>
#draw-show {
    width: 780px;
    margin: 50px auto;
    text-align: center;
}
.individual-seading>h2 {
    float: left;
}
.individual-seading>ul {
    margin: 0 0 20px 40px;    
}
.team {
    display: inline-block;
    width: 60px;
    margin-right: 20px;
    text-align: center;
}
.team img {
    border: 1px solid #000;
    width: 40px;
}
</style>