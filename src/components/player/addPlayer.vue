<!-- 
    http://localhost:8080/teams/teamTable/:id/addPlayer 
-->
<!-- 使用$route.query通信 -->
<!-- 利用动态路由$route.params中不同的键值 -->
<template>
	<div class="add">
		<h4 v-if="errorText">{{ errorText }}</h4>
		<!-- .prevent修饰符 -->
		<form v-on:submit.prevent='addPlayer'>
			<fieldset>
				<legend>球员信息表</legend>
				<!-- 姓名 必填-->
				<div class="infoRow">
					<label for="name">姓名</label>
				    <input id="name" type="text" required v-model.trim="addedPlayer.name" @blur="nameErrorFlag = true">         <!-- 使用.trim -->
				    <span class="format-warn" v-if="nameErrorFlag === true">{{ nameError.errorText }}</span>
				</div>
				<!-- 号码 必填-->				
				<div class="infoRow">
					<label for="number">号码</label>
				    <input id="number" type="number" required v-model.number="addedPlayer.number">  <!-- 使用.number -->
				</div>
				<!-- 年龄 必填-->				
				<div class="infoRow">
					<label for="age">年龄</label>
				    <input id="age" type="number" required v-model.number="addedPlayer.age">
				</div>
				<!-- 位置 必填-->				
				<div class="infoRow">
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
				<div class="infoRow">
					<label for="club">俱乐部</label>
				    <input id="club" type="text" required v-model.trim="addedPlayer.club">
				</div>
				<!-- 出生日期 -->				
				<div class="infoRow">
					<label for="birthDate">出生日期</label>
				    <input id="birthDate" type="date" v-model="addedPlayer.birthDate">
				</div>
				<!-- 身高 -->
				<div class="infoRow">
					<label for="height">身高(cm)</label>
				    <input id="height" type="text" v-model="addedPlayer.height" @blur="heightErrorFlag=true">
				    <span class="format-warn" v-if="heightErrorFlag === true">{{ heightError.errorText }}</span>
				</div>
				<!-- 简介 -->					
				<div class="infoRow">
					<label for="intro">简介</label>
				    <textarea id="intro" rows="10" cols="50" v-model="addedPlayer.intro"></textarea>
				</div>
				<div class="infoRow">
					<label for="button"></label>
				  	<button type="submit">提交</button>
				    <button type="reset">重置</button>
			    </div>		
			</fieldset>
		</form>
	</div>
</template>

<script>
export default {
	name: 'addPlayer',
	data() {
		return {
            addedPlayer: {},
            currentTeam: {},
            currentId: this.$route.params.id,
            errorText: '',
            nameErrorFlag: false,
            heightErrorFlag: false
		}
	},
	computed: {
        // 函数尽量封装，将nameError和heightError分开
        // 首次进入时会显示error。定义flag，@blur和v-if控制显示隐藏/或控制text
        nameError() {
        	let item = this.addedPlayer.name;
        	let reg = /^[a-zA-Z\u4e00-\u9fa5]+((·[a-zA-Z\u4e00-\u9fa5]+)?)$/;
        	let text = '输入格式错误，样例：Lionel Messi, Messi, 里奥.梅西，梅西';
        	return this.inputError(item,reg,text);
        },
        heightError() {
            let item = this.addedPlayer.height;
            let reg = /^\d{3}$/;
            let text = '输入格式错误，必须是三位数字';
            return this.inputError(item,reg,text);
        }
    },
	mounted() {
		this.$axios.get(`http://localhost:3000/teams/${this.currentId}`)
		.then(res => {
		    this.currentTeam = res.data;
		});
	},
	methods: {
		addPlayer() {
            if(this.nameError.status && this.heightError.status) {
	            // HACK: 这里只能post到teams层，不能post到下一层
	            let newKeyPlayer = JSON.parse(JSON.stringify(this.addedPlayer));
	            this.currentTeam.keyPlayers.push(newKeyPlayer);
	            this.$axios.put(`http://localhost:3000/teams/${this.currentId}`, this.currentTeam)
	            .then(res => {
	                // 跳转到teams/teamTable/:id页面
	                // FIXME: 之前使用this.currentId,只能用bus非父子组件的通信
	                // 教程也是在addPlayer.vue中直接post数据，通过router.push和query传递信息
	                // XXX: 注意path的id没有冒号
	                this.$router.push({
	                    path: '/teams/teamTable/' + this.currentId,
	                    query: {alert: '球员信息添加成功'}
	                });
	                // OTHER: 使用 this.$router.go(-1);
	                // 要向teamTable页面传递alert信息,非父子组件通信
	                // 按照教程里是在customers的create钩子里监听$routes.query,更新alert值
	            });
	        }
	        else {
	        	this.errorText = '球员信息不完整或不正确';
	        }
		},
		// v-model不能用过滤器filters
		// 封装错误提示函数
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