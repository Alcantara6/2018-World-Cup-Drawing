<template>
    <div id="app">
        <header id="app-header">
        <!-- router-link不能直接绑定props，
        一般用$routes传，所以App.vue不去获取teamList -->
            <router-link to="/"><h1>indexPage</h1></router-link>
            <router-link to="/teams"><h1>teams</h1></router-link>
            <router-link to="/draw"><h1>draw</h1></router-link>
        </header>
        <keep-alive>  
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
#app {
    margin: 0 20px;
}
#app-header {
    height: 30px;
    margin-bottom: 10px;
}
#app-header h1 {
    display: inline-block;
    padding: 10px;
    font-size: 16px;
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
a:hover {
    color: #0000A0;
}
a:visited {
    text-decoration: underline;
    color: #00F;
}
a img, 
div img {
    vertical-align: top;
}
input, select, label {
    display: inline-block;
    box-sizing: border-box;
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
* {
    transition: background-color .5s;
    transition: opacity .5s;
}
</style>
