<template>
	<Overlay :is-shown="isShown" @close="close">
		<template #header>
			<h1>Enter the post details</h1>
		</template>
		<template #default>
			<DraftForm
				:id="CREATE_POST_FORM_ID"
				v-model="content"
				@submit-post="createPost"/>
		</template>
		<template #footer>
			<button
				class="btn btn-back"
				type="button"
				@click="close">
				Back
			</button>
			<button
				class="btn submit-btn btn-primary"
				:form="CREATE_POST_FORM_ID"
				type="button">
				Create post
			</button>
		</template>
	</Overlay>
</template>

<style lang="scss">
@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { ref } from "vue"

import Fetcher from "$@/fetchers/post"

const CREATE_POST_FORM_ID = "create-post"
const fetcher = new Fetcher()

const { isShown } = defineProps<{ isShown: boolean }>()

const content = ref("")

interface CustomEvents {
	(event: "close"): void
}
const emit = defineEmits<CustomEvents>()

function close() {
	emit("close")
}

function createPost(data: FormData): void {
	fetcher.createWithFile(data).then()
}
</script>
