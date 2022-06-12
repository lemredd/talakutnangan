<template>
	<h1 class="text-2rem">Manage Semester</h1>
    <div class="container m-5 border border-solid border-dark-900 rounded-t-1rem w-100% h-50% bg-gray-700">

     <main>
         <form class="items-left p-5 text-light-100">
            <div class = "flex items-center">
				<h1 class="text-1em">Semester 1</h1>
                <TextualField class = "p-5" label="" type="email" v-model="sd"/>
                <TextualField class = "p-5" label="" type="email" v-model ="ed"/>
				<button class="ml-auto text-right bg-green-300">edit</button>
            </div>
            <div class = "flex items-center">
                <h1 class="text-1em">Semester 2</h1>
				<TextualField class = "p-5" label="" type="text" v-model="sd"/>
                <TextualField class = "p-5" label="" type="text" v-model = "ed"/>
				<button class="ml-auto text-right bg-green-300">edit</button>
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

const role = ref("student")
const sd= ref("Start date")
const ed = ref("End date")
</script>
