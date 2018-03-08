<!-- 
    http://localhost:8000/teams
-->
<!-- 3-7 每次添加或删除球员数据后,用beforeRouteUpdate从后台获取更新后的数据 -->

<template>
	<div class="teams-overview">
        <header><h1>2018年世界杯32强阅兵</h1></header>
        
        <section id="teams-wrap">
            <h2 class="teams-title">各大洲晋级决赛圈球队</h2>
            <!-- 显示各个大洲球队 -->
            <div class="continent" v-for="teams in continentTeams">
                <!-- 不使用v-if会报错 Cannot read property 'continent' of undefined -->
                <h2 v-if="teams.length">{{ teams[0].continent }} （{{ teams.length }}支）</h2>
                <ul>
                    <li class="team" v-for="team in teams">
                        <!-- 跳转到某只球队，由于是32支球队各一个路由，所以不用v-for的index -->
                        <router-link :to="'/teams/teamTable/' + team.id">
                            <img :src="team.flagUrl">
                        </router-link>
                        <router-link :to="'/teams/teamTable/' + team.id">
                            {{ team.teamName }}({{ team.pot }})
                        </router-link>   
                    </li>
                </ul>
            </div>
        </section>

        <section id="players-wrap">
            <h2 class="players-title">关键球员数据<span>点击球队标志查看、编辑各队关键球员</span></h2>
            <!-- 因为有更新数据，不能添加keep-alive,跳转到该路由后不能执行mounted中的内容(从后台获取更新后的数据),如果执行activated中的呢？ -->
            <!-- <keep-alive> -->
            <router-view tag="div" :teams="teamList"></router-view>
            <!-- </keep-alive> -->
        </section> 
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
    },
    mounted() {
        // 获取json数据,使用$nextTick先渲染DOM
        this.$nextTick(function () {
            this.fetchTeams();
        });
    },
    // 每次添加或删除球员数据后，跳转回teamTable页面，需要从后台获取新的数据，因此在父组件teamsPage中加入beforeRouteUpdate，由于是复用该组件，所以用beforeRouteUpdate而不是beforeRouteEnter
    beforeRouteUpdate(to,from,next) {
        this.fetchTeams();
        next();
    }
} 
</script>

<style scoped>
/*共用*/
.teams-title,
.players-title {    
    margin-bottom: 20px;
    text-align: center;
    color: #9f000f;
    border-bottom: 1px solid #9f000f;
}
.players-title span {
    padding: 0 10px;
    font-size: 14px;
    font-weight: 400;
    color: #000;
}
/*标题*/
header {
    position: relative;
    text-align: center;
    margin-bottom: 20px;
}
header>h1 {
    position: relative;
    display: inline;
    padding: 0 1em;
    background: #fff;
    z-index: 9;
}
header:after {        /*使用伪类添加横杠修饰*/
    content: '';
    width: 100%;
    height: 0;
    position: absolute;
    top: 50%;
    left: 0;
    border: .5px solid #ccc;
}
/*左侧区域*/
#teams-wrap {
    width: 45%;
    float: left;
}
.continent {
    margin-bottom: 5px;
}
.continent>h2 {
    font: 16px/2 'Hiragino GB' bold;
}
.team {
    margin: 0 10px 5px 0;
    display: inline-block;
}
.team a {
    display: block;
    text-align: center;
    color: #000;
}
.team img {
    border: 1px solid #000;
}

/*右侧区域*/
#players-wrap {
    margin: 0 0 10px 50%;
}
</style>