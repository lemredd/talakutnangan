<template>
	<div
		v-for="(comment, i) in comments"
		:key="comment.id"
		class="comment">
		<Viewer v-model="comments[i]"/>
		<br/>
	</div>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">
import { computed } from "vue"

import type { DeserializedCommentResource } from "$/types/documents/comment"

import Viewer from "@/comment/multiviewer/viewer.vue"

const props = defineProps<{
	modelValue: DeserializedCommentResource<"user"">[]
}>()

interface CustomEvents {
	(
		event: "update:modelValue",
		comment: DeserializedCommentResource<"user"">[]
	): void
}
const emit = defineEmits<CustomEvents>()

const comments = computed<DeserializedCommentResource<"user"">[]>({
	get(): DeserializedCommentResource<"user"">[] {
		return props.modelValue
	},
	set(newValue: DeserializedCommentResource<"user"">[]): void {
		emit("update:modelValue", newValue)
	}
})
</script>
