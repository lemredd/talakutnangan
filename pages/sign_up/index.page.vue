<template>
<div class="container">
     <header>
         <h1>TALAKUTNANGAN</h1>
     </header>

     <main>
         <h2>SIGN UP PAGE</h2>
         <form class="flex flex-col">
             <TextualField label="E-mail" type="email" v-model="email"/>
             <TextualField label="Password" type="password" v-model="password"/>
         </form>
     </main>

    <img :src="WhiteCake"/>
</div>
</template>

<style>
</style>

<script setup lang="ts">
import { ref, computed } from "vue"
import TextualField from "@/fields/Textual.vue"
import WhiteCake from "./white_cake.png"

const email = ref("sample@sample.com")
const password = ref("password123")
</script>
