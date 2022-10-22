<template>
	<form @submit.prevent="updateUser">
		<div class="user-name">
			<NonSensitiveTextField
				v-model="user.data.name"
				label="User Name"
				type="text"
				:editable="true"/>
		</div>

		<div class="controls flex justify-between">
			<button type="submit" class="btn btn-primary">
				Submit
			</button>
			<button
				v-if="isDeleted"
				type="button"
				class="btn btn-primary"
				@click="restoreUser">
				Restore
			</button>
			<button
				v-else
				type="button"
				class="btn btn-primary"
				@click="archiveUser">
				Archive
			</button>
		</div>
	</form>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import {
	ref,
	inject,
	computed,
	onMounted
} from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserDocument } from "$/types/documents/user"

import Fetcher from "$@/fetchers/user"

import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"

type RequiredExtraProps = "user"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const user = ref<DeserializedUserDocument>(
	pageProps.user as DeserializedUserDocument
)
const isDeleted = computed<boolean>(() => Boolean(user.value.deletedAt))

let rawFetcher: Fetcher|null = null

function fetcher(): Fetcher {
	if (rawFetcher) return rawFetcher

	throw new Error("User cannot be processed to server yet")
}

async function updateUser() {
	await fetcher().update(user.value.data.id, {
		"email": user.value.data.email,
		"kind": user.value.data.kind,
		"name": user.value.data.name,
		"prefersDark": user.value.data.prefersDark
	})
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

async function archiveUser() {
	await fetcher().archive([ user.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

async function restoreUser() {
	await fetcher().restore([ user.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

onMounted(() => {
	rawFetcher = new Fetcher()
})
</script>
