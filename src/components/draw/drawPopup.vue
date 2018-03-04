<!-- 3-4 插槽方式加入弹框组件，用于进入界面和抽中球队、位次落位的确认 -->
<!-- 分发内容的CSS只能在父组件设置（可继承的属性除外，可以在子组件slot元素外层加一个标签，设置CSS，分发的内容会继承 -->
<template>
	<!-- 不能在#draw-popup总体使用transiton，对#draw-popup-box的过渡无效 -->
	<div id="draw-popup">
	    <transition name="shade">
		    <!-- 遮罩 注意top和left -->
			<div id="shade" v-if="isShow"></div>
		</transition>
	    <transition name="box">
		    <!-- 对话框 -->	
			<div id="draw-popup-box" v-if="isShow">
				<div class="box-top"></div>
				<div class="box-content"> 
				    <div class="popupInfo">
				        <slot name="image"></slot>
				    	<slot name="text">球队名和分组位置</slot>
				    </div>
				    <button class="popupBtn" @click="confirm">
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
	name:"draw-popup",
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
/* 遮罩 注意top和left*/
.shade-enter-active,
.shade-leave-active {
	transition: opacity .3s;
	position: absolute;  /*必须加absoulute,否则会破坏页面结构*/
}
.shade-enter,
.shade-leave-to {
	opacity: 0;
}
.box-enter-active,
.box-leave-active {
	transition: opacity .8s;
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
/* 对话框 注意top和left*/
#draw-popup-box {
	position: absolute;
	left: 50%;
	top: 20%;
	margin-left: -25%;
	z-index: 99;
	/*height:最大屏幕高度的60%（margin的高度用100%表示则是基于父元素的宽度*/
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
/*popup插槽*/
.popupInfo {
    padding: 30px 0 20px;
}
.popupBtn {
    width: 150px;
    margin: 0 auto;
    padding: 10px;
    font-size: 16px;
    background: #306eff;
    color: #fff;
}
</style>