<!-- 
    http://localhost:8080/teams/teamTable/:id/playerData/:playerId
-->
<!-- 不能直接通过axios.get获取player -->
<!-- this.$route.params.id的id为{string}，做数组标号时可以不用转化为Number -->
<!-- todo: 用props获取球队数据 -->
<template>
	<div class="playerData">
        <div class="content">
            <!-- XXX: HTML渲染时需要对数据team进行检测,script中不需 -->
            <ul v-if="team.hasOwnProperty('keyPlayers')">
                <li v-for="(value,key) in team.keyPlayers[currentPlayerId]">
                {{ key }}:{{ value }}
                </li>
            </ul>
            <!-- 返回按钮 -->
            <router-link class="backBtn" :to="`/teams/teamTable/${this.currentId}`">返回</router-link>
            <!-- 编辑按钮 -->
            <router-link class="btn editBtn" to="edit" tag="button" append>编辑</router-link>
            <!-- 删除按钮 -->
            <button class="btn deleteBtn" @click="isShowDialog=true">删除</button>
        </div>
        <!-- 删除对话框 -->
        <dialog-delete v-if="isShowDialog" :isShow="isShowDialog" @confirmDel="deletePlayer" @cancelDel="isShowDialog=false"></dialog-delete>
	</div>
</template>

<script>
import dialogDelete from "../base/dialog-delete"
export default {
	name: 'playerData',
    components: {
        dialogDelete
    },
	data() {
		return {
            team: {},
            // @value {String}currentId,currentPlayerId
            currentId: this.$route.params.id,
            currentPlayerId: this.$route.params.playerId,
            isShowDialog: false
		}
	},
    mounted() {
        // 不能直接获取内层keyPlayers
        this.fetchTeam(this.currentId);
    },
    methods: {
        // 获取该球员信息
        fetchTeam(id) {
            this.$axios.get('http://localhost:3000/teams/' + id)
            .then(res => {
              this.team = res.data;
            })
            .catch(error => {
              console.log(error);
            });    
        },
        // 删除该球员
        deletePlayer() {
            this.team.keyPlayers.splice(this.currentPlayerId, 1);
            this.$axios.put(`http://localhost:3000/teams/${this.currentId}`, this.team)
            .then(res => {
                this.$router.push({
                    path: '/teams/teamTable/' + this.currentId,
                    query: {alert: '球员删除成功'}   
                });
            });  
        }
    }
} 
</script>

<style scoped>


</style>