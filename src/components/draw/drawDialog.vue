<template>
	<div id="draw-dialog">
	    <!-- 遮罩  -->
	    <transition name="shade"> 
			<div id="shade" v-if="isShow"></div>
		</transition>
		<!-- 对话框 -->	
	    <transition name="box">
			<div id="draw-dialog-box" v-if="isShow">
				<div class="box-top"></div>
				<div class="box-content"> 
				    <div class="dialogInfo">
				        <slot name="image"></slot>
				    	<slot name="text">球队名和分组位置</slot>
				    </div>
				    <button class="dialogBtn" @click="confirm">
				        <slot name="buttonTxt">确认按钮</slot>
				    </button>
				</div>
			</div>
		</transition>
	</div>
</transition>
</template>

<script>
export default {
	name:"draw-dialog",
	props: {
		isShow: {
			type: Boolean,
			dafault: false
		}
	},
	methods:{
		// 确认删除，自定义事件
		confirm() {
			this.$emit("next");
		}
	}
}
</script>

<style scoped>
/* 遮罩*/
.shade-enter-active,
.shade-leave-active {
	transition: opacity .2s;
	/*必须加absoulute,否则会破坏页面结构*/
	position: absolute;  
}
.shade-enter,
.shade-leave-to {
	opacity: 0;
}

.box-enter-active,
.box-leave-active {
	transition: opacity .3s;
}
.box-enter,
.box-leave-to {
	opacity: 0;
}

#shade {
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	opacity: .5;
	background: #bbb;
	z-index: 99;
}
/* 对话框 */
#draw-dialog-box {
	position: absolute;
	left: 50%;
	top: 20%;
	margin-left: -25%;
	z-index: 99;
	/*height:最大屏幕高度的50%*/
	width: 50%;
	min-height: 300px;
	max-height: 60%;    
	overflow: auto;
	background: #fefcff;
	transition: all .5s;
}
.box-top {
	height: 50px;
	background: #306eff;
}
.box-content {
	padding-bottom: 20px;
	text-align: center;
	font: 24px/2 Helvetica, "Heiti SC";
	font-weight: 700;
}
/*dialog插槽*/
.dialogInfo {
    padding: 30px 0 20px;
}
.dialogBtn {
    width: 150px;
    margin: 0 auto;
    padding: 10px;
    font-size: 16px;
    background: #306eff;
    color: #fff;
    border: 1px solid #000;
    outline-width: 0;
}
.dialogBtn:hover {
    background: #43bfc7;
}
</style>