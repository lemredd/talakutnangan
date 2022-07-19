<template>
	<DeptManager :data="departments" >
		<button class="material-icons">add</button>
	</DeptManager>
</template>

<script setup lang="ts">
import { ref } from "vue"
import DeptManager from "@/user_management/DataManager.vue"
import type { Department } from "@/user_management/types"

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
