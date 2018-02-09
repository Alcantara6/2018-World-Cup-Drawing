<!-- 
    http://localhost:8000/teams
-->
<template>
	<div class="teams-overview">
        <header class="teams-wrap">
            <!-- 显示各个大洲球队 -->
            <div class="continent" v-for="teams in continentTeams">
                <!-- 不使用v-if会报错 Cannot read property 'continent' of undefined -->
                <h2 v-if="teams.length">{{ teams[0].continent }}</h2>
                <ul>
                    <li class="team" v-for="team in teams">
                        <!-- 跳转到某只球队，由于是32支球队各一个路由，所以不用v-for的index -->
                        <router-link :to="'/teams/teamTable/' + team.id">
                            <img :src="team.flagUrl">
                        </router-link>
                        <router-link :to="'/teams/teamTable/' + team.id">
                            {{ team.teamName }}({{ team.seading }})
                        </router-link>    
                    </li>
                </ul>
            </div>
        </header>
        <!-- 因为有更新数据，不能添加keep-alive,跳转到该路由后不能执行mounted中的内容 -->
        <!-- <keep-alive> -->
        <router-view id="main" tag="div"></router-view>
        <!-- </keep-alive> -->        
	</div>
</template>

<script>
export default {
	name: 'teams',
	data() {
		return {
            teamList: []
		}
	},
    computed: {	
        continentTeams() {
            return [
                this.teamList.filter(item => 
                    item.continent === '欧洲'
                ),
                this.teamList.filter(item => 
                    item.continent === '南美洲'
                ),
                this.teamList.filter(item => 
                    item.continent === '中北美及加勒比海地区'
                ),
                this.teamList.filter(item => 
                    item.continent === '非洲'
                ),
                this.teamList.filter(item => 
                    item.continent === '亚洲'
                )
            ]
		}
	},
    mounted() {
        // 获取json数据,使用$nextTick先渲染DOM
        this.$nextTick(function () {
            this.fetchTeams();
        });
    },
    methods: {
        fetchTeams() {
            // this.$axios.get("/api/teamsData").then(res => {
            //     this.teamList = res.data.data;
            // }).catch(error => {
            //     console.log(error);
            // });
            this.$axios.get("http://localhost:3000/teams")
            .then(res => {
              this.teamList = res.data;
            })
            .catch(error => {
              console.log(error);
            });    
        }
    }
} 
</script>

<style scoped>
.teams-overview {
    max-width: 90%;
    margin: 30px 50px;
}
.continent {
    width: 100%;
}
.team {
    margin-right: 5px;
    display: inline-block;
    text-align: center;
}
.team img {
    border: 1px solid #000;
}
#main {

}
</style>