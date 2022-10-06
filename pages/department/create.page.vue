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
import { inject, ref } from "vue"
import DepartmentFetcher from "$@/fetchers/department"
import type { DeserializedPageContext } from "$@/types/independent"

const pageContext = inject("pageContext") as DeserializedPageContext

const fullName = ref("")
const acronym = ref("")
const mayAdmit = ref(false)

const fetcher = new DepartmentFetcher()

function createDepartment() {
	fetcher.create({
		fullName: fullName.value,
		acronym: acronym.value,
		mayAdmit: mayAdmit.value
	})
	.then(({ body, status }) => {

	})
	.catch(({ body, status }) => {
		// Output error
	})
}
</script>
