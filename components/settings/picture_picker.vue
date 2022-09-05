<template>
	<div>
		<!-- TODO: Refactor all WindiCSS inline classes using `@apply` directive -->
		<h3 class="display-name text-lg">{{ title }}</h3>
		<div class="picture-container">
			<img v-if="pictureToDisplay" :src="pictureToDisplay"/>
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
import { ref } from "vue"
import convertForParameter from "$/string/convert_for_parameter"

const { title, picture } = defineProps<{
	title: string
	picture: string | null
}>()

const pictureToDisplay = ref(picture)
const inputId = convertForParameter(title)

function loadImage(event: Event) {
	const target = event.target as HTMLInputElement
	const [ file ] = target.files as FileList
	const fileObjectURL = URL.createObjectURL(file)

	pictureToDisplay.value = fileObjectURL
}
</script>
