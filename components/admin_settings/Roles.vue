<template>
<div class="controls-bar mb-5">
    <div class="search-bar">
        <TextualField
				type="email"
				v-model="searchFilter"
				input-classes="!py-0 pl-1 !border-none !w-100" />
			<button class="material-icons">search</button>        
    </div>
</div>
	<div class="roles pb-2">
		<span>Role Name</span>
        <div class="roles-numbers">
        <span class="material-icons person">person</span>
        <span>{{roles}}</span>
        </div>
        
		<div class="btns">
		    <button class="btn1">Edit</button>
            <button class="btn2">X</button>
	    </div>
    </div>
</template>

<style lang = "scss">
.controls-bar {
	@apply dark:bg-dark-100 bg-light-600 grid gap-y-4 sm:grid-cols-2;
	padding: .5em;

	.search-bar {
		@apply dark:bg-dark-300 bg-gray-300 flex justify-between items-center;
		padding: .25em;
	}
}

.roles{
    display:flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid black;
}
.roles-numbers{
    display:flex;
    justify-content: space-between;
    align-items: center;
}

.btn1 {
		@apply dark:bg-dark-300 bg-light-600 rounded-md w-20 text-base h-7;
	}
.btn2 {
		@apply dark:bg-dark-300 bg-light-600 rounded-md w-10 text-base h-7;
	}
</style>

<script setup lang="ts">
import { ref } from "vue"
import TextualField from "@/fields/Textual.vue"

const roles = "x-is a number of users"
const searchFilter = ref("")
</script>
