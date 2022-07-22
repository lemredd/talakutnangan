<template>
	<form @submit.prevent="createDepartment">
		<label class="block">
			Full name:
			<input class="border-solid" type="text" id="full-name" v-model="fullName"/>
		</label>
		<label class="block">
			Acronym:
			<input class="border-solid" type="text" id="acronym" v-model="acronym"/>
		</label>
		<label class="block">
			May admit students:
			<input type="checkbox" id="may-admit" v-model="mayAdmit"/>
		</label>
		<input type="submit" value="Create department"/>
	</form>
</template>

<style>
</style>

<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue"
import DepartmentFetcher from "$@/communicators/department"
import type { DeserializedPageContext } from "$@/types/independent"

const pageContext = inject("pageContext") as DeserializedPageContext

const fullName = ref("")
const acronym = ref("")
const mayAdmit = ref(false)

DepartmentFetcher.initialize("/api")

function createDepartment() {
	DepartmentFetcher.create({
		fullName: fullName.value,
		acronym: acronym.value,
		mayAdmit: mayAdmit.value
	})
	.then(({ body, status }) => {
		console.log(body, status)

		if (status >= 400) {
			// Output error
		}
	})
}
</script>
