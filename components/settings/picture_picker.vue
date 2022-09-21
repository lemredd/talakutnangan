<template>
	<form>
		<!-- TODO: Refactor all WindiCSS inline classes using `@apply` directive -->
		<h3 class="display-name text-lg">
			{{ title }}
		</h3>

		<div class="picture-container">
			<Picture v-if="picture"/>
			<div v-else class="no-image flex justify-center">
				<label :for="`input-${inputId}`" class="flex flex-col items-center justify-center">
					<span class="material-icons">add_circle</span>
					<input
						type="hidden"
						name="data[type]"
						value="profile_picture"/>
					<input
						:id="`input-${inputId}`"
						type="file"
						name="data[attributes][fileContents]"
						accept="image/"
						class="input-pic"
						@change="submitImage"/>
					<small class="text-center">
						Drag and drop or upload image
					</small>
				</label>
			</div>
		</div>
	</form>
</template>

<style scoped lang="scss">
.input-pic {
	display: none;
}

.picture-container {
	@apply relative p-1 w-35 h-35 rounded-0.8rem bg-dark-100 flex justify-center;
}
</style>

<script setup lang="ts">
import type { DeserializedSignatureDocument } from "$/types/documents/signature"
import type { DeserializedProfilePictureDocument } from "$/types/documents/profile_picture"

import Picture from "@/helpers/picture.vue"
import convertForParameter from "$/string/convert_for_parameter"

type PossiblePictures = DeserializedProfilePictureDocument | DeserializedSignatureDocument

const props = defineProps<{
	title: string
	picture: PossiblePictures | undefined
}>()
// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
	(event: "submitFile", data: FormData): void
}>()

const inputId = convertForParameter(props.title)

function submitImage(event: Event) {
	const target = event.target as HTMLInputElement
	const form = target.form as HTMLFormElement
	const formData = new FormData(form)

	emit("submitFile", formData)
}
</script>
