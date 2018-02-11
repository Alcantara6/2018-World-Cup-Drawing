<!-- 
    http://localhost:8080/teams/teamTable/:id/playerData/:playerId/edit 
-->
<!-- 基本copy自addPlayer.vue相同 -->
<!-- todo: 用props获取球队数据 -->
<template>
	<div class="edit">
		<h4 v-if="alert">{{ alert }}</h4>
		<!-- .prevent修饰符 -->
		<form v-on:submit.prevent='editPlayer'>
			<fieldset>
				<legend>编辑球员信息</legend>
				<!-- 姓名 不可更改-->
				<div class="infoRow">
					<label for="name">姓名</label>
				    <input id="name" type="text" disabled v-model="playerInfo.name">
				</div>
				<!-- 号码 必填-->				
				<div class="infoRow">
					<label for="number">号码</label>
				    <input id="number" type="number" required v-model.number="playerInfo.number">
				</div>
				<!-- 年龄 必填-->				
				<div class="infoRow">
					<label for="age">年龄</label>
				    <input id="age" type="number" required v-model="playerInfo.age">
				</div>
				<!-- 位置 必填-->				
				<div class="infoRow">
					<label for="role">位置</label>
				    <select id="role" required v-model="playerInfo.role">
                        <option disabled value=""></option>
                        <option value="前锋">前锋</option>
                        <option value="中场">中场</option>
                        <option value="后卫">后卫</option>
				    </select>
				</div>
				<!-- 俱乐部 必填-->				
				<div class="infoRow">
					<label for="club">俱乐部</label>
				    <input id="club" type="text" required v-model="playerInfo.club">
				</div>
				<!-- 出生日期 -->				
				<div class="infoRow">
					<label for="birthDate">出生日期</label>
				    <input id="birthDate" type="date" v-model="playerInfo.birthDate">
				</div>
				<!-- 身高 -->
				<div class="infoRow">
					<label for="height">身高(cm)</label>
				    <input id="height" type="text" v-model="playerInfo.height" @blur="heightErrorFlag=true">
				    <span v-if="heightErrorFlag === true">{{ heightError.errorText }}</span>
				</div>
				<!-- 简介 -->					
				<div class="infoRow">
					<label for="intro">简介</label>
				    <textarea id="intro" rows="10" cols="50" v-model="playerInfo.intro"></textarea>
				</div>
				<div class="infoRow">
					<label for="button"></label>
				  	<button type="submit">确认</button>
				    <router-link :to="{name:'playerData', params:{playerId:currentPlayerId}}" tag="button">返回</router-link>
			    </div>				
			</fieldset>
		</form>
	</div>
</template>

<script>
export default {
	name: 'editPlayer',
	data() {
		return {
            currentId: this.$route.params.id,
            currentPlayerId: this.$route.params.playerId,
            currentTeam: {},
            playerInfo: {},
            heightErrorFlag: false,
            alert: ''
		}
	},
	computed: {
        heightError() {
            let item = this.playerInfo.height;
            let reg = /^\d{3}$/;
            let text = '输入格式错误，必须是三位数字';
            return this.inputError(item,reg,text);
        }
    },	
	mounted() {
		this.$nextTick(function () {
			this.fetchPlayer();
		});
	},
	methods: {
		fetchPlayer() {
            this.$axios.get(`http://localhost:3000/teams/${this.currentId}`)
            .then(res => {
                // XXX: 不能放在computed
                this.currentTeam = res.data;
                this.playerInfo
                = res.data.keyPlayers[this.currentPlayerId];
            });
		},
		editPlayer() {
            // 引用类型，直接更新，无需在创建新的currentTeam
            if(this.heightError.status) {
	            this.$axios.put(`http://localhost:3000/teams/${this.currentId}`, this.currentTeam)
	            .then(res => {
	                this.$router.go(-1);  // .go(-1)
	            });
	        }
	        else {
	        	this.alert = '球员信息不完整或不正确';
	        }    
        },
        inputError(item,reg,text) {
            let status =false;
            let errorText = '';
            if(!reg.test(item)) {
            	status = false;
            	errorText = text;
            }
            else {
                status = true;
                errorText = '';
            }
            return {
            	status,
            	errorText
            }
		}        
	}
} 
</script>

<style scoped>
.add {
	max-width: 800px;
}
fieldset {
	display: table;
}
legend {
	display: table-caption;
	text-align: center;
	font-size: 16px;
	font-weight: 700;
}
.infoRow {
	display: table-row;
}
.infoRow>label,
.infoRow>input,
.infoRow>select {
	display: table-cell;
	height:25px;
	width: 200px;
	margin-bottom: 10px;
	vertical-align: top;
}
.infoRow>label {
	width:100px;
	padding-right: 20px;
	text-align: right;
}
.infoRow button {
	width: 50px;
	margin-right: 20px;
}
</style>