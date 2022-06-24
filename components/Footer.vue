<template>
<footer>
    <div class="links">
        <div v-for="N in 4" class ="footer1">
            <h1>Footer</h1>
            <ul>
                <li v-for = "N in 3">Sub Footer</li>
            </ul>
        </div>
    </div>
    <div class="copyright">
        <span class="material-icons footer1">copyright</span>
        <span>2022 Talakutnangan, All rights reserved.</span>
    </div>
</footer>
</template>
<style scoped lang="scss">
footer {
    display:flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: #313131;
    color: #fff;
    padding: -1em 3em;

    .links {
        display:flex;
        justify-content: space-around;
    }
}
.copyright{
    display:flex;
    align-items: center;
    justify-content: center;
    background-color: #313131;
    color: #fff;

}
.footer1 {
        
        padding: 5px;
        
}

</style>

<script lang="ts" setup>

</script>
