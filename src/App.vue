<template>
    <div id="app">
        <header id="app-header"></header>
        <router-link to="/">indexPage</router-link>
        <router-link to="/teams">teams</router-link>
        <router-link to="/draw">draw</router-link>
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
#app-header {
    height: 30px;
    margin-bottom: 10px;
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
