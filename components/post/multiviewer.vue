<template>
	<div
		v-for="(post, i) in posts"
		:key="post.id">
		<Viewer
			v-model="posts[i]"
			class="viewer"
			:comment-count="1"/>
	</div>
</template>

<style scoped lang="scss">
	div {
		@apply flex flex-col flex-nowrap;

		.viewer {
			@apply flex-1 mb-8;
		}
	}
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { DeserializedPostResource } from "$/types/documents/post"

import Viewer from "@/post/multiviewer/viewer.vue"

const props = defineProps<{
	modelValue: DeserializedPostResource<"poster"|"posterRole"|"department">[]
}>()

interface CustomEvents {
	(
		event: "update:modelValue",
		post: DeserializedPostResource<"poster"|"posterRole"|"department">[]
	): void
}
const emit = defineEmits<CustomEvents>()

const posts = computed<DeserializedPostResource<"poster"|"posterRole"|"department">[]>({
	get(): DeserializedPostResource<"poster"|"posterRole"|"department">[] {
		return props.modelValue
	},
	set(newValue: DeserializedPostResource<"poster"|"posterRole"|"department">[]): void {
		emit("update:modelValue", newValue)
	}
})
</script>
