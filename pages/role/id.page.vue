<template>
	<div v-if="isRolePresent">
		<div class="role-name">
			<h1>{{ role.name }}</h1>
		</div>
	</div>
	<div v-else>
		Loading...
	</div>
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, inject, ref, computed } from "vue"

import type { PageContext } from "#/types"
import type { DeserializedRoleDocument } from "$/types/documents/role"

import RoleFetcher from "$@/fetchers/role"
import deserialize from "$/helpers/deserialize"

const pageContext = inject("pageContext") as PageContext
const roleId = pageContext.routeParams!.id

console.log("role id", roleId)

RoleFetcher.initialize("/api")

const role = ref()
const isRolePresent = computed(() => {
	return role.value !== undefined
})

onMounted(async () => {
	await new RoleFetcher().read(10)
	.then(response => {
		const { body } = response
		const deserializedData = (deserialize(body)! as DeserializedRoleDocument).data
		role.value = deserializedData
	})
})
</script>
