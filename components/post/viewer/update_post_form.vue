<template>
	<Overlay :is-shown="isShown" @close="close">
		<template #header>
			<h1>Enter the post details</h1>
		</template>
		<template #default>
			<DraftForm
				:id="postID"
				v-model="content"
				@submit-post="updatePost"/>
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
				:form="postID"
				type="button">
				Update post
			</button>
		</template>
	</Overlay>
</template>

<style lang="scss">
@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { DeserializedPostResource } from "$/types/documents/post"

const props = defineProps<{
	isShown: boolean,
	modelValue: DeserializedPostResource<"poster"|"posterRole">
}>()

interface CustomEvents {
	(event: "close"): void,
	(event: "submit", postID: string): void,
	(event: "update:modelValue", content: DeserializedPostResource<"poster"|"posterRole">): void
}
const emit = defineEmits<CustomEvents>()

const postID = computed<string>(() => props.modelValue.id)
const content = computed<string>({
	get(): string {
		return props.modelValue.content
	},
	set(newValue: string): void {
		emit("update:modelValue", {
			...props.modelValue,
			"content": newValue
		})
	}
})

function close() {
	emit("close")
}

function updatePost(): void {
	emit("submit", postID.value)
}
</script>
