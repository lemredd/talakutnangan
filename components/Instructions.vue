<template>
    <div class="bg-dark-200 w-auto rounded-3xl h-auto p-15">
    <h1 class="text-center text-5xl">Participate in a forum</h1>
    <div class="flex grid-cols-2">
    <div class="ttl text-2xl right-auto">
        <p>1. lorem ipsum.</p>
        <p>2. dolor sit amet.</p>
        <p>3. consectetur adipisicing elit.</p>
        <p>4. add more steps if necesarry</p>
        
        </div>
    <div class="ttl left-auto">
        <div class="ps1">
        <span class="psn2 material-icons">person</span>
        <div class="cmp1 material-icons">campaign</div>
        <span class="psn3 material-icons">person</span>
        <span class="psn4 material-icons">person</span>
        <span class="psn5 material-icons">person</span>
    </div>
    </div>
    </div>
    </div>

<div class="spc1 bg-dark-200 w-auto rounded-3xl h-auto p-15">
    <h1 class="text-center text-5xl">Start a consultation</h1>
    <div class="flex grid-cols-2">
    <div class="ttl">
    <div class="ps">
        <span class="psn material-icons">person</span>
        <span class="msg material-icons">chat</span>
        <span class="msg1 material-icons">chat</span>
        <span class="psn1 material-icons">person</span>
    </div>
    </div>
        <div class="ttl text-2xl">
        <p>1. lorem ipsum.</p>
        <p>2. dolor sit amet.</p>
        <p>3. consectetur adipisicing elit.</p>
        <p>4. add more steps if necesarry</p>
        
        </div>
    </div>
    </div>

</template>

<style>

.ps{

    position:relative;
    height: 220px;

}

.ps1{

    position:relative;
    height: 280px;

}

.psn2{
    position:absolute;
    margin-left:200px;
    font-size:200px;
    margin-top:-40px;
}

.psn3{
    position:absolute;
    font-size:100px;
    margin-top:145px;

}

.psn4{
    position:absolute;
    font-size:100px;
    margin-left:60px;
    margin-top:100px;

}

.psn5{
    position:absolute;
    font-size:100px;
    margin-top:180px;
    margin-left:70px;
}

.cmp1{
    position:absolute;
    transform: scaleX(-1);
    font-size:95px;
    margin-left:140px;
    margin-top:-30px;

}

.psn{

 position:absolute;
 font-size:150px;

}

.psn1{

 position:absolute;
 font-size:200px;
 margin-left:150px;
 margin-top:30px;

}

.msg{
    
    position:absolute;
    margin-bottom:100px;
    margin-left:120px;
    font-size:60px;
}

.msg1{
    
    position:absolute;
    transform: scaleX(-1);
    margin-bottom:100px;
    margin-left:180px;
    font-size:60px;
}


.ttl{

    margin-top:60px;
    width:50%;
}

.spc1 {

margin-top:60px;

}

</style>

<script setup lang="ts">
</script>
