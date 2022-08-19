<template>
	<Overlay :is-shown="isShown">
		<template #header>
			<h1>Enter the consultation details</h1>
		</template>
		<template #default>
			<p>Sample</p>
		</template>
		<template #footer>
			<button type="button">
				Set the schedule
			</button>
		</template>
	</Overlay>
</template>
<script setup lang="ts">
import Overlay from "@/helpers/overlay.vue"

const { isShown } = defineProps<{ "isShown": boolean }>()
</script>
