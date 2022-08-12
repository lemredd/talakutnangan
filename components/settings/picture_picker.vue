<template>
<div>
	<!-- TODO: Refactor all WindiCSS inline classes using `@apply` directive -->
	<h3 class="display-name text-lg">{{ title }}</h3>
	<div class="picture-container relative p-1 w-35 h-35 rounded-0.8rem bg-dark-100 flex justify-center">
		<img v-if="pictureToDisplay" :src="pictureToDisplay">
		<div v-else class="no-image flex justify-center">
			<label :for="`input-${inputId}`" class="flex flex-col items-center justify-center">
				<span class="material-icons">add_circle</span>
				<input type="file" accept="image/" :id="`input-${inputId}`" class="input-pic" @change="loadImage($event, 'profilePic')">
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
</style>

<script setup lang="ts">
import { ref } from "vue"
import TextTransformer from "$@/helpers/text_transformers"

const { title, picture } = defineProps<{
	title: string
	picture: string | null
}>()

const transformText = new TextTransformer()

const pictureToDisplay = ref(picture)
const inputId = transformText.toParamCase(title)
console.log(inputId)

function loadImage(e: Event, type: string) {
	const target = e.target as HTMLInputElement
	const [file] = target.files!
	const fileObjectURL = URL.createObjectURL(file)

	pictureToDisplay.value = fileObjectURL
}
</script>
