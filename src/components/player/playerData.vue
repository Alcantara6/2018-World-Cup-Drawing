<!-- 
    http://localhost:8080/teams/teamTable/:id/playerData/:playerId
-->
<!-- 不能直接通过axios.get获取player -->
<!-- this.$route.params.id的id为{string}，做数组标号时可以不用转化为Number -->
<!-- 用props获取球队数据，用JSON.parse(Json.stringify)拷贝对象 -->

<!-- 3-7 XXX: 异步数据或未定义属性在HTML渲染时的判断：使用v-if，注意逐层判断，判断是否存在和是否为空的区别-->
<!-- 计算属性可以正常计算，只是第一刻加载时如果有异步数据则不能在HTML渲染；如果计算属性依赖的某属性不存在，取undefined即可，但如果语法错误了，也不能正常计算 -->
<!-- XXX: 因为要操作team数据，所以不采用从父组件获取数据（异步传输问题没了），而是直接从后台请求 -->
<template>
	<div class="playerData">
        <div class="content">
            <!-- 异步从父组件获取teams，HTML必须检测team -->
            <!-- 因为要操作team数据，所以不采用从父组件获取数据，而是直接从后台请求 -->
            <!--  -->
            <h2 v-if="team.keyPlayers">{{ player.name }}</h2>
            <dl>
                <dt>{{ infoRefer.nation }}</dt>
                <dd>{{ team.teamName }}</dd>
            </dl>
            <!-- v-if和v-for的优先级，v-if在前作为整个列表的前提条件-->
            <template v-if="team.keyPlayers">
                <dl 
                    v-for="(value,key) in player"
                    v-if="key !== 'playerId' && key !== 'name'">
                    <dt>{{ infoRefer[key] }}</dt>
                    <dd>{{ value }}</dd>
                </dl>
            </template>

            <!-- 编辑按钮 -->
            <router-link class="btn editBtn" to="edit" tag="button" append>
                编辑球员
            </router-link>
            <!-- 删除按钮 -->
            <button class="btn deleteBtn" @click="isShowDialog=true">
                删除球员
            </button>
            <!-- 返回按钮 -->
            <router-link class="back" :to="`/teams/teamTable/${this.currentId}`">
                &lt;&lt;返回{{ team.teamName }}队球员列表
            </router-link>
        </div>
        <!-- 删除对话框 -->
        <dialog-delete 
            v-if="isShowDialog" 
            :isShow="isShowDialog" 
            @confirmDel="deletePlayer" 
            @cancelDel="isShowDialog=false">
        </dialog-delete>
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
            infoRefer: {
                'name': '姓名',
                'nation': '国籍',
                'club': '效力俱乐部',
                'age': '年龄',
                'height': '身高',
                'number': '号码',
                'role': '场上位置',
            },
            team: {},
            // @value {String}currentId,currentPlayerId
            currentId: this.$route.params.id,
            currentPlayerId: this.$route.params.playerId,
            isShowDialog: false
		}
	},
    computed: {
        player() {
            return this.team.keyPlayers[this.currentPlayerId];
        }    
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
    },

    mounted() {
        // 不能直接获取内层keyPlayers
        this.fetchTeam(this.currentId);
    },
} 
</script>

<style scoped>
.content {
    padding-top: 10px;
}
dl {
    display: flex;
}
dt,dd {
    margin: 5px 10px 5px 0;
    width: 100px;
    font: 14px/1.5 'FangSong' bold;
    cursor: pointer;
}
dd {
    background: #9172ec;
    color: #fff;
    text-align: center;
}
.btn {
    width: 80px;
    margin: 10px 10px 5px 0;
    padding: 3px 5px;
    border: none;
    outline-width: 0;
    color: #fff;
}
.editBtn {
    background: #d9534f;
}
.deleteBtn {
    background: #306eff;
}
.back {
    display: block;
}
</style>