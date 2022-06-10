<template>
<div class="container m-25  border border-solid border-dark-900 rounded-0.8rem w-100% h-50% bg-dark-500">
	 <!-- <main>
		 <form class="flex flex-col items-left text-light-100">
			<div class ="p-5 flex items-center">
				<TextualField  label="E-mail" type="email"  v-model="email"/>
				<button class="material-icons">edit</button>
			</div>
			<div class ="p-5 flex items-center">
			 <TextualField  label="Password" type="password" v-model="password"/>
			 <button class="material-icons">edit</button>
			 </div>
			 <div class ="p-5 flex items-center">
			 <TextualField  label="Student Number" type="string" v-model="studentNo"/>
			 <button class="material-icons">edit</button>
			 </div>
			 <div class ="p-5 flex items-center">
			 <TextualField  label="Institute" type="string" v-model="institute"/>
			 <button class="material-icons">edit</button>
			 </div>
			 <div class ="p-5 flex items-center">
			 <TextualField  label="Roles" type="string" v-model="role"/>
			 <button class="material-icons">edit</button>
			 </div>
		 </form>
	 </main> -->
	<main>
		<form class="flex flex-col items-left text-light-100">
			<div class ="p-5 flex flex-col">
				<h3 class="display-name text-lg">Display Name</h3>
				<h5 class="name">Sample Display F. Name</h5>
			</div>
			<div class ="p-5 flex flex-col">
				<h3 class="display-name text-lg">Profile Name</h3>
				<div class="picture-container p-1 w-35 h-35 rounded-0.8rem bg-dark-100 flex flex-col items-center justify-center">
					<div class="image"></div>
					<button class="material-icons">add_circle</button>
					<small class="text-center">Drag and drop or upload image</small>
				</div>
			</div>
			<div class ="p-5 dark-mode-toggle">
				<h3 class="display-name text-lg col-span-full">Dark Mode</h3>
				<h5 class="name">Lorem5</h5>
				<input type="checkbox" name="" id="">
			</div>
		 </form>
	 </main>

</div>
</template>

<style scoped lang="scss">
	.dark-mode-toggle {
		display: grid;
		grid-template:
			"formHeader formHeader"
			"subtitle toggle";

		h3 {
			width: max-content;
			grid-area: formHeader;
		}

		h5 {
			width: max-content;
			grid-area: subtitle;
		}

		input {
			width: max-content;
			grid-area: toggle
		}
	}
</style>

<script setup lang="ts">
import { ref, computed } from "vue"
import TextualField from "@/fields/Textual.vue"

const email = ref("sample@sample.com")
const password = ref("password123")
const studentNo = ref("1920-xxxx")
const institute = ref("Institute of Name")
const role = ref ("Roles")
</script>
