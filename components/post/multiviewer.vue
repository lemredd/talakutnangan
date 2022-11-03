<template>
	<div
		v-for="(post, i) in posts"
		:key="post.id"
		class="post">
		<Viewer
			v-model="posts[i]"
			:comment-count="0"/>
	</div>
</template>

<style scoped lang="scss">

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
