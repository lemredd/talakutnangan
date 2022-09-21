<template>
	<div>
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
						:id="`input-${inputId}`"
						type="file"
						accept="image/"
						class="input-pic"
						@change="loadImage($event)"/>
					<small class="text-center">
						Drag and drop or upload image
					</small>
				</label>
			</div>
		</div>
	</div>
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
import { DeserializedSignatureDocument } from "$/types/documents/signature"
import { DeserializedProfilePictureDocument } from "$/types/documents/profile_picture"

import Picture from "@/helpers/picture.vue"
import convertForParameter from "$/string/convert_for_parameter"

type PossiblePictures = DeserializedProfilePictureDocument | DeserializedSignatureDocument

const props = defineProps<{
	title: string
	picture: PossiblePictures | undefined
}>()
// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
	(event: "pickedFile", pickedFile: string): void
}>()

const inputId = convertForParameter(props.title)

function loadImage(event: Event) {
	const target = event.target as HTMLInputElement
	const [ file ] = target.files as FileList
	const fileObjectURL = URL.createObjectURL(file)

	emit("pickedFile", fileObjectURL)
}
</script>
