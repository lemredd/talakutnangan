<template>
	<div
		v-for="(post, i) in posts"
		:key="post.id"
		class="post">
		<Viewer v-model="posts[i]"/>
		<br/>
	</div>
</template>

<style scoped lang="scss">
.post-container {
	@apply outline-solid-black overflow-hidden
}
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { DeserializedPostResource } from "$/types/documents/post"

import Viewer from "@/post/multiviewer/viewer.vue"

const props = defineProps<{
	modelValue: DeserializedPostResource<"poster"|"posterRole">[]
}>()

interface CustomEvents {
	(event: "update:modelValue", post: DeserializedPostResource<"poster"|"posterRole">[]): void
}
const emit = defineEmits<CustomEvents>()

const posts = computed<DeserializedPostResource<"poster"|"posterRole">[]>({
	get(): DeserializedPostResource<"poster"|"posterRole">[] {
		return props.modelValue
	},
	set(newValue: DeserializedPostResource<"poster"|"posterRole">[]): void {
		emit("update:modelValue", newValue)
	}
})
</script>
