<template>
<div class="controls-bar mb-5">
    <div class="search-bar">
        <TextualField
				type="email"
				v-model="searchFilter"
				input-classes="!py-0 pl-1 !border-none" />
			<button class="material-icons">search</button>
    </div>
	<button class="material-icons">add</button>
</div>
	<div class="departments ">
		<div class="department py-2 flex flex-col sm:flex-row sm:justify-between items-center border-b border-black" v-for="department in departments">
			<h3>{{ department.name }}</h3>
			<div class="users flex">
				<span class="material-icons">person</span>
				<span class="number">{{ department.users }} users</span>
			</div>

			<div class="controls">
				<button>Edit</button>
				<button class="material-icons">delete</button>
			</div>
		</div>
	</div>
</template>

<style lang = "scss">
.controls-bar {
	@apply dark:bg-dark-100 bg-light-600 grid gap-y-4 sm:grid-cols-[repeat(2,minmax(0,max-content))] justify-between;
	padding: .5em;

	.search-bar {
		@apply dark:bg-dark-300 bg-gray-300 flex justify-between items-center;
		padding: .25em;
	}
}

.departments{

	.controls button {
		@apply dark:bg-dark-300 bg-light-600 rounded-md w-20 text-base h-7;
	}
}

</style>

<script setup lang="ts">
import { ref } from "vue"
import TextualField from "@/fields/Textual.vue"
import type { Department } from "@/user_management/types"

const roles = "x-is a number of users"
const searchFilter = ref("")

const departments = ref<Department[]>([
	{
		id: 0,
		name: "Department 1",
		users: 999
	},
	{
		id: 1,
		name: "Department 2",
		users: 999
	}
])
</script>
