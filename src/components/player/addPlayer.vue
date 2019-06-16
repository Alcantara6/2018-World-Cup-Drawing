<!-- 
    http://localhost:8080/teams/teamTable/:id/addPlayer 
-->

<template>
	<div class="add">
		<h4 class="error-text" v-if="errorText">{{ errorText }}</h4>
		<!-- .prevent修饰符 -->
		<form v-on:submit.prevent='addPlayer'>
			<fieldset class="player-info">
				<legend>球员信息表</legend>
				<!-- 姓名 必填。使用.trim-->
				<div class="info-row">
					<label for="name">姓名</label>
				    <input id="name" type="text" required v-model.trim="addedPlayer.name" 
				        @blur="nameErrorFlag = true">
				    <span class="format-warn" v-if="nameErrorFlag === true">
					    {{ nameError.errorText }}
				    </span>
				</div>
				<!-- 号码 必填。使用.number-->			
				<div class="info-row">
					<label for="number">号码</label>
				    <input id="number" type="number" required v-model.number="addedPlayer.number">
				</div>
				<!-- 年龄 必填-->				
				<div class="info-row">
					<label for="age">年龄</label>
				    <input id="age" type="number" required v-model.number="addedPlayer.age">
				</div>
				<!-- 位置 必填-->			
				<div class="info-row">
					<label for="role">位置</label>
				    <select id="role" required v-model="addedPlayer.role">
                        <option disabled value="">请选择</option>
                        <option value="前锋">前锋</option>
                        <option value="中场">中场</option>
                        <option value="后卫">后卫</option>
                        <option value="守门员">守门员</option>
				    </select>
				</div>
				<!-- 俱乐部 必填-->				
				<div class="info-row">
					<label for="club">俱乐部</label>
				    <input id="club" type="text" required v-model.trim="addedPlayer.club">
				</div>
				<!-- 出生日期 -->				
				<div class="info-row">
					<label for="birthDate">出生日期</label>
				    <input id="birthDate" type="date" v-model="addedPlayer.birthDate">
				</div>
				<!-- 身高 -->
				<div class="info-row">
					<label for="height">身高(cm)</label>
				    <input id="height" type="text" v-model="addedPlayer.height" 
				        @blur="heightErrorFlag=true">
				    <span class="format-warn" v-if="heightErrorFlag === true">
					    {{heightError.errorText }}
					</span>
				</div>
				<!-- 简介 -->					
				<div class="info-row">
					<label for="intro">简介</label>
				    <textarea id="intro" rows="10" cols="50" v-model="addedPlayer.intro"></textarea>
				</div>
				<div class="info-row">
					<label for="button"></label>
				  	<button type="submit">提交</button>
				    <button type="reset">重置</button>
			        <router-link 
			    	    class="back"
			    	    :to="`/teams/teamTable/${this.currentId}`">
			    	    &lt;&lt; 返回
			        </router-link>
			    </div>
			</fieldset>
		</form>
	</div>
</template>

<script>
import {methods as util} from '../../utils/methods';
export default {
	name: 'addPlayer',
	props: ['teams'],
	data() {
		return {
            addedPlayer: {},
            currentId: this.$route.params.id,
            errorText: '',
             // 首次进入时会显示error。定义flag，@blur和v-if控制显示隐藏/及控制text
            nameErrorFlag: false,
            heightErrorFlag: false
		}
	},
	computed: {
        currentTeam() {
        	return JSON.parse(JSON.stringify(this.teams[this.currentId]));
        },
        nameError() {
        	// 如果没有输入，则为空字符串
        	let item = this.addedPlayer.name?this.addedPlayer.name:'';  
        	let reg = /^[a-zA-Z\u4e00-\u9fa5]+((·[a-zA-Z\u4e00-\u9fa5]+)?)$/;
        	let text = '输入格式错误，样例：Lionel Messi, Messi, 里奥·梅西，梅西';
        	return util.inputError(item,reg,text);
        },
        heightError() {
            // 如果没有输入，则为空字符串
            let item = this.addedPlayer.height?this.addedPlayer.height:'';
            let reg = /^\d{3}$/;
            let text = '输入格式错误，必须是三位数字';
            return util.inputError(item,reg,text);
        }
    },

	methods: {
		addPlayer() {
            if(this.nameError.status && this.heightError.status) {
	            // HACK: JSON-server,只能向teams层put，不能向keyPlyers层post
	            let playerId = this.currentTeam.keyPlayers.length;
	            // 手动添加playerId
	            this.$set(this.addedPlayer, 'playerId', playerId);
	            this.currentTeam.keyPlayers.push(this.addedPlayer);
	            this.$axios.put(`http://localhost:3000/teams/${this.currentId}`, this.currentTeam)
		            .then(res => {
		                // 跳转到teams/teamTable/:id页面
		                // 在teamTable的create或mounted钩子里监听$routes.query,更新alert值
		                this.$router.push({
		                    path: '/teams/teamTable/' + this.currentId,
		                    query: {alert: '球员信息添加成功'}
		                });
		            });
	        }
	        else {
	        	// 如果html不加required才显示errorText
	        	this.errorText = '球员信息不完整或不正确';
	        }
		}
	}
} 
</script>

<style scoped>
.add {
    width: 700px;
	margin: 0 auto;
}
.player-info {
	position: relative;
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
button[type='reset'] {
	background: #306eff;
}
.back {
	position: absolute;
	left: 0;
	top: 0;
	padding: 20px 10px;
	font: 14px/1.5 "宋体";
	color: #fff;
}

/*输入错误提示*/
.format-warn {
	color: #d9543f;
	padding: 0 10px;
}
</style>