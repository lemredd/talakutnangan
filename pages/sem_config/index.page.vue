<template>
	<h1 class="text-2rem">Manage Semester</h1>
	<main>
		<form class="items-left p-5 text-light-100">
			<div class="semester">
				<h1 class="text-1em">Semester 1</h1>
				<TextualField label="" type="email" v-model="sd"/>
				<TextualField label="" type="email" v-model ="ed"/>
				<button class="edit-btn">edit</button>
			</div>
			<div class="semester">
				<h1 class="text-1em">Semester 2</h1>
				<TextualField label="" type="text" v-model="sd"/>
				<TextualField label="" type="text" v-model = "ed"/>
				<button class="edit-btn">edit</button>
			</div>
		</form>
	</main>
</template>

<style scoped lang = "scss">
input {
	width:50%;
}
main {
	margin-top: 1.25em;
	border: 1px solid rgb(15,15,15);
	border-radius: 1em 1em 0 0;
	width: 100%;

	background-color: gray;

	.semester {
		@apply flex items-center;

		.edit-btn {
			@apply ml-auto text-right;
		}
	}
}
</style>

<script setup lang="ts">
import { ref } from "vue"
import TextualField from "@/fields/non-sensitive_text.vue"

const sd= ref("Start date")
const ed = ref("End date")
</script>
