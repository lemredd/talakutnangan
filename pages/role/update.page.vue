<template>
hello
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted } from "vue"

import type { DeserializedRoleListDocument } from "$/types/documents/role"

import RoleFetcher from "$@/fetchers/role"
import deserialize from "$/helpers/deserialize"

RoleFetcher.initialize("/api")

onMounted(async () => {
	await new RoleFetcher().list({
		filter: {
			existence: "exists",
			department: "*"
		},
		page: {
			limit: 10,
			offset: 0
		},
		sort: ["name"]
	}).then(response => {
		const { body } = response
		const deserializedData = deserialize(body) as DeserializedRoleListDocument
		console.log(deserializedData)
	})
})
</script>
