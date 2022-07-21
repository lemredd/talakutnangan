<template>
	<RolesManager :data="roles" >
		<button class="material-icons">add</button>
	</RolesManager>
</template>

<script setup lang="ts">
import { ref } from "vue"
import RolesManager from "@/user_management/DataManager.vue"
import type { Role } from "@/user_management/types"

const roles = ref<Role[]>([
	{
		id: 0,
		name: "Role 1",
		users: 555
	},
	{
		id: 1,
		name: "Role 2",
		users: 555
	}
])
</script>
