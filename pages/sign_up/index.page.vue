<template>
<div class="container m-25 pb-50  border border-solid border-dark-900 rounded-0.8rem w-100% h-50% bg-dark-500">
     <header>
         <h1 class="text-center p-5 bg-gray-500 rounded-t-0.8rem text-light-100">TALAKUTNANGAN</h1>
     </header>

     <main>
         <h2 class="text-center p-5 text-light-100">SIGN UP PAGE</h2>
         <form class="flex flex-col items-center">
             <TextualField  label="E-mail" type="email"  v-model="email"/>
             <TextualField  label="Password" type="password" v-model="password"/>
         </form>
     </main>

</div>
</template>

<style>
</style>

<script setup lang="ts">
import { ref, computed } from "vue"
import TextualField from "@/fields/Textual.vue"

const email = ref("sample@sample.com")
const password = ref("password123")
</script>
