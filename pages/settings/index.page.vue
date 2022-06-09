<template>
<div class="container m-25 border border-solid border-dark-900 rounded-0.8rem w-100% h-50% bg-dark-500">

     <main>
         <form class="items-left p-5 text-light-100">
            <div class = "flex items-center">
				<TextualField class = "p-5" label="E-mail" type="email" v-model="emailRef"/>
				<button class="material-icons">edit</button>
			</div>
            <div class = "flex items-center">
				<TextualField class = "p-5" label="Password" type="password" v-model="passwordRef"/>
				<button class="material-icons">edit</button>
			</div>
            <div class = "flex items-center">
				<TextualField class = "p-5" label="Student Number" type="text" v-model="studentNo"/>
			</div>
            <div class = "flex items-center">
				<TextualField class = "p-5" label="Institute" type="text" v-model="institute"/>
			</div>
            <div class = "flex items-center">
				<TextualField class = "p-5"  label="Role" type="text" v-model="role"/>
			</div>
         </form>
     </main>

</div>
</template>

<style scoped lang = "scss">
@import "https://fonts.googleapis.com/icon?family=Material+Icons";
input {
        width:50%;


}
</style>

<script setup lang="ts">
import { ref, computed } from "vue"
import TextualField from "@/fields/Textual.vue"

const emailRef = ref("sample@sample.com")
const passwordRef = ref("password123")
const studentNo = ref("1920-xxxx")
const institute = ref("INS (Institute of Name Sample")
const role = ref("student")
</script>
