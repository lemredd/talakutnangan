<template>
	<form>
		<label class="block">
			Full name:
			<input class="border-solid" type="text" v-model="fullName"/>
		</label>
		<label class="block">
			Acronym:
			<input class="border-solid" type="text" v-model="acronym"/>
		</label>
		<label class="block">
			May admit students:
			<input type="checkbox" v-model="mayAdmit"/>
		</label>
	</form>
</template>

<style>
</style>

<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue"

import type { DeserializedPageContext } from "$@/types/independent"

const pageContext = inject("pageContext") as DeserializedPageContext

const fullName = ref("")
const acronym = ref("")
const mayAdmit = ref(false)
</script>
