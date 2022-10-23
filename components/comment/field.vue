<template>
	<form>
		<ProfilePicture
			class="self"
			:user="user"/>
		<TextualField
			v-model="content"
			v-model:status="fieldStatus"
			class="field"
			type="text"
			:may-save-implicitly="true"
			@save-implicitly="submit"
			@save="submit"/>
	</form>
</template>

<style lang="scss">
	form {
		@apply flex flex-row flex-nowrap justify-center;

		> .self {
			@apply flex-initial w-auto h-12;
		}

		> .field {
			@apply flex-1 ml-4 flex flex-row;
		}
	}
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { FieldStatus } from "@/fields/types"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedCommentResource } from "$/types/documents/comment"

import TextualField from "@/fields/unlabeled_text.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

interface CustomEvents {
	(event: "update:modelValue", data: string): void
	(event: "update:status", status: FieldStatus): void
	(event: "submitComment"): void
}
const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	parentComment?: DeserializedCommentResource,
	user: DeserializedUserDocument,
	status: FieldStatus,
	modelValue: string
}>()

const content = computed<string>({
	get(): string {
		return props.modelValue
	},
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})
const fieldStatus = computed<FieldStatus>({
	get(): FieldStatus {
		return props.status
	},
	set(newValue: FieldStatus): void {
		emit("update:status", newValue)
	}
})

function submit() {
	emit("submitComment")
}
</script>
