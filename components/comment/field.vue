<template>
	<form @submit.prevent>
		<ProfilePicture
			class="self"
			:user="user"/>
		<TextualField
			v-model="content"
			v-model:status="fieldStatus"
			class="field"
			input-classes="raw-field"
			type="text"
			placeholder="Write a comment..."
			:may-save-implicitly="true"
			@save-implicitly="submit"/>
	</form>
</template>

<style scoped lang="scss">
	form {
		@apply flex flex-row flex-nowrap justify-center items-center;
		@apply mb-5;

		> .self {
			@apply flex-initial w-auto h-12 mr-2;
		}

		> .field {
			@apply flex-1 flex flex-row;
			@apply dark:text-white;
			border-bottom: 1px solid hsla(0,0%,60%,0.3);

			.raw-field:not(:disabled) {
				@apply border-none p-4 rounded-1rem w-[100%];
			}
		}
	}
</style>

<style lang="scss">
	form {
		> .field {
			.raw-field:not(:disabled) {
				@apply border-none p-4 rounded-1rem w-[100%];
			}
		}
	}
</style>
<script setup lang="ts">
import { computed } from "vue"

import type { FieldStatus } from "@/fields/types"
import type { DeserializedUserDocument } from "$/types/documents/user"

import TextualField from "@/fields/unlabeled_text.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

interface CustomEvents {
	(event: "update:modelValue", data: string): void
	(event: "update:status", status: FieldStatus): void
	(event: "submitComment"): void
}
const emit = defineEmits<CustomEvents>()
const props = defineProps<{
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
