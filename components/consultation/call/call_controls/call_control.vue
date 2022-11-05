<template>
	<button class="material-icons call-control" :title="title">
		{{ materialIcon }}
	</button>
</template>

<style scoped lang="scss">
.call-control {
	@apply mx-4 border rounded-md py-2 px-4;
}
</style>

<script setup lang="ts">
type DefinedProps = {
	title: string
	materialIcon: string
}
defineProps<DefinedProps>()
</script>
