<!-- 
    http://localhost:8080/teams/teamTable/:id/playerData/:playerId/edit 
-->
<!-- 基本copy自addPlayer.vue相同 -->
<!-- todo: 与addPlayer复用css-->
<!-- 3-7 XXX: 因为要操作team数据，所以不采用从父组件获取数据，而是直接从后台请求 -->
<template>
	<div class="edit">
		<h4 class="error-text" v-if="errorText">{{ errorText }}</h4>
		<!-- .prevent修饰符 -->
		<form v-on:submit.prevent='editPlayer'>
			<fieldset class="player-info">
				<legend>编辑球员信息</legend>
				<!-- 姓名 不可更改-->
				<div class="info-row">
					<label for="name">姓名</label>
				    <input id="name" type="text" disabled v-model="playerInfo.name">
				</div>
				<!-- 号码 必填-->				
				<div class="info-row">
					<label for="number">号码</label>
				    <input id="number" type="number" required v-model.number="playerInfo.number">
				</div>
				<!-- 年龄 必填-->				
				<div class="info-row">
					<label for="age">年龄</label>
				    <input id="age" type="number" required v-model="playerInfo.age">
				</div>
				<!-- 位置 必填-->				
				<div class="info-row">
					<label for="role">位置</label>
				    <select id="role" required v-model="playerInfo.role">
                        <option disabled value=""></option>
                        <option value="前锋">前锋</option>
                        <option value="中场">中场</option>
                        <option value="后卫">后卫</option>
				    </select>
				</div>
				<!-- 俱乐部 必填-->				
				<div class="info-row">
					<label for="club">俱乐部</label>
				    <input id="club" type="text" required v-model="playerInfo.club">
				</div>
				<!-- 出生日期 -->				
				<div class="info-row">
					<label for="birthDate">出生日期</label>
				    <input id="birthDate" type="date" v-model="playerInfo.birthDate">
				</div>
				<!-- 身高 -->
				<div class="info-row">
					<label for="height">身高(cm)</label>
				    <input id="height" type="text" v-model="playerInfo.height" 
				        @blur="heightErrorFlag=true">
				    <span v-if="heightErrorFlag === true">{{ heightError.errorText }}</span>
				</div>
				<!-- 简介 -->					
				<div class="info-row">
					<label for="intro">简介</label>
				    <textarea id="intro" rows="10" cols="50" v-model="playerInfo.intro"></textarea>
				</div>
				<div class="info-row">
					<label for="button"></label>
				  	<button type="submit">确认</button>
				    <router-link 
					    class="back"
					    :to="{name:'playerData', params:{playerId:currentPlayerId}}" 
					    tag="button">返回
				    </router-link>
			    </div>				
			</fieldset>
		</form>
	</div>
</template>

<script>
export default {
	name: 'editPlayer',
	props: {
		teams: [Array]
	},
	data() {
		return {
            currentId: this.$route.params.id,
            currentPlayerId: this.$route.params.playerId,
            heightErrorFlag: false,
            errorText: ''
		}
	},
	computed: {
        heightError() {
            let item = this.teams[this.currentId].keyPlayers[this.currentPlayerId].height;
            let reg = /^\d{3}$/;
            let text = '输入格式错误，必须是三位数字';
            return this.inputError(item,reg,text);
        },
        currentTeam() {
        	return this.teams[this.currentId];
        },
        playerInfo() {
        	return this.currentTeam.keyPlayers[this.currentPlayerId];
        }
    },	
	methods: {	
		editPlayer() {
            // 引用类型，直接更新，无需在创建新的currentTeam
            if(this.heightError.status) {
	            this.$emit('edit', {id: this.currentId, team: this.currentTeam});
	        }
	        else {
	        	// 如果html不加required
	        	this.errorText = '球员信息不完整或不正确';
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
.edit {
    width: 700px;
	margin: 0 auto;
}
.player-info {
	padding: 20px 0;
	background: #3d3c3a;
	border: none;
	color: #fff;
}
legend {
	margin-bottom: 10px;
	text-align: center;
	font-size: 16px;
	transform: translateY(70%);
	color: #ff0;
}
.info-row {
	margin-bottom: 15px;
	font: 14px/1.5 "STXiHei";
}
.info-row>label,
.info-row>input,
.info-row>select {
	height: 25px;
	line-height: 25px;
	width: 150px;
	vertical-align: top;
}
.info-row>label {
	width: 100px;
	padding-right: 20px;
	text-align: right;
	color: #ff0;
}
.info-row button {
	width: 50px;
	margin-right: 20px;
	padding: 3px 5px;
	border: none;
	outline-width: 0;
	color: #fff;
}
button[type='submit'] {
	background: #d9534f;
}
button.back {
	background: #306eff;
}

/*输入错误提示*/
.format-warn {
	color: #d9543f;
	padding: 0 10px;
}
</style>