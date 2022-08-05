<template>
	<Suspensible :is-loaded="isRolePresent">
		<div class="role-name" v-if="role">
			<h1>{{ role.name }}</h1>
		</div>
	</Suspensible>
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, inject, ref, computed } from "vue"

import type { PageContext } from "#/types"
import type { DeserializedRoleDocument, DeserializedRoleResource } from "$/types/documents/role"

import RoleFetcher from "$@/fetchers/role"
import deserialize from "$/helpers/deserialize"
import Suspensible from "@/suspensible.vue"

const pageContext = inject("pageContext") as PageContext
const roleId = pageContext.routeParams!.id

RoleFetcher.initialize("/api")

const role = ref<null | DeserializedRoleResource>(null)
const isRolePresent = computed(() => {
	return role.value !== null
})

onMounted(async () => {
	await new RoleFetcher().read(+roleId)
	.then(response => {
		const { body } = response
		const deserializedData = (deserialize(body)! as DeserializedRoleDocument).data
		role.value = deserializedData
	})
})
</script>
