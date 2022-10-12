<template>
	<Overlay :is-shown="isShown" @close="close">
		<template #header>
			<h1>Enter the post details</h1>
		</template>
		<template #default>
			<DraftForm
				:id="postID"
				v-model="content"
				@submit-post="updatePost">
				<div v-if="hasMultipleRoles" class="row">
					<SelectableOptionsField
						v-model="roleID"
						label="Post as: "
						placeholder="Choose the role"
						:options="roleNames"/>
				</div>
			</DraftForm>
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
import { computed, watch } from "vue"

import type { OptionInfo } from "$@/types/component"
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedUserDocument } from "$/types/documents/user"

import UserFetcher from "$@/fetchers/user"

const userFetcher = new UserFetcher()

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

const isShown = computed<boolean>(() => props.isShown)
const hasLoadedCompletePosterInfo = computed<boolean>(() => {
	const hasRoles = Boolean(props.modelValue.poster.data.roles)
	return hasRoles
})

const hasMultipleRoles = computed(() => {
	if (hasLoadedCompletePosterInfo.value) {
		const completePosterInfo = props.modelValue.poster as DeserializedUserDocument<"roles">

		return completePosterInfo.data.roles.data.length
	}

	return false
})
const roleNames = computed<OptionInfo[]>(() => {
	if (hasMultipleRoles.value) {
		const completePosterInfo = props.modelValue.poster as DeserializedUserDocument<"roles">

		return completePosterInfo.data.roles.data.map(data => ({
			"label": data.name,
			"value": data.id
		}))
	}

	return []
})
const roleID = computed<string>({
	get(): string {
		return props.modelValue.posterRole.data.id
	},
	set(newValue: string): void {
		let currentRole = props.modelValue.posterRole.data

		if (hasMultipleRoles.value) {
			const completePosterInfo = props.modelValue.poster as DeserializedUserDocument<"roles">

			currentRole = completePosterInfo.data.roles.data.find(
				data => data.id === newValue
			) as DeserializedRoleResource<"read">
		}

		emit("update:modelValue", {
			...props.modelValue,
			"posterRole": {
				"data": currentRole
			}
		})
	}
})

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

watch(isShown, newValue => {
	if (newValue && !hasLoadedCompletePosterInfo.value) {
		userFetcher.read(props.modelValue.poster.data.id).then(({ body }) => {
			emit("update:modelValue", {
				...props.modelValue,
				"poster": body
			})
		})
	}
})
</script>
