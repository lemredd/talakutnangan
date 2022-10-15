<template>
	<progress
		:value="Number($attrs.current)"
		max="100">
	</progress>
</template>

<script setup lang="ts">
// ? props seems to be treated as undefined and attribute
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	"current": number
}>()
</script>
