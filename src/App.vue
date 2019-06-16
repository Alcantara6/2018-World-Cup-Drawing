<template>
    <div id="app">
        <header id="app-header">
        <!-- 导航栏 -->
            <nav id="nav">
                <router-link to="/teams"><h1>球队球员一览</h1></router-link>
                <router-link to="/draw"><h1>模拟抽签</h1></router-link>
            </nav>
        </header>
        <!-- 导航栏结束 -->
        <!-- 主内容 -->
        <router-view></router-view>
        <!-- 主内容结束 -->
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
#app {
    min-width: 1024px;
    margin: 0px 20px;
}
#app-header {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    background: #5471b0;
    color: #fff;
}
#nav {
    display: flex;
}
#nav a {
    display: block;
    padding: 0 10px;
    line-height: 40px;
    color: #fff;
}
#nav a:hover,
#nav .router-link-active {
    background-color: #9f000f;
}
#nav h1 {
    font-size:16px;
}

* {
    margin: 0; 
    padding: 0;
}
body {
    font:12px/1.5 Tahoma, Helvetica, Arial, "Microsoft YaHei", "Hiragino GB", Sans-serif;
}
ul,ol {
    list-style-type: none;
}
a {
    text-decoration: none;
}
a:link {
    color: #000;
}
a:visited {
    text-decoration: underline;
    color: #000;
}
a img, 
div img {
    vertical-align: top;
}
input, select, label {
    display: inline-block;
    box-sizing: border-box;
}
button {
    cursor: pointer;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
  display: block;
}
*:before,
*:after {
    box-sizing: border-box;
}
</style>
