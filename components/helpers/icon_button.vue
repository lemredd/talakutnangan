<template>
	<div>
		<button
			type="button"
			class="material-icons"
			@click="emitIconClickEvent">
			{{ iconName }}
		</button>
		<slot name="associated-pop-outs"></slot>
	</div>
</template>

<style scoped lang="scss">
	div {
		@apply flex flex-row flex-nowrap justify-center items-center h-12 w-12;

		> button:first-child {
			@apply flex-1 m-auto;
		}
	}
</style>

<script setup lang="ts">
defineProps<{
	iconName: string
}>()
interface CustomEvents {
	(event: "iconClick"): void
}
const emit = defineEmits<CustomEvents>()

function emitIconClickEvent() {
	emit("iconClick")
}
</script>
