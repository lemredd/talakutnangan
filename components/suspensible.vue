<template>
	<div class="suspensible">
		<div v-if="isLoaded" class="loaded">
			<slot></slot>
		</div>

		<div v-else class="loading">
			Loading...
		</div>
	</div>
</template>

<style>
</style>

<script setup lang="ts">

const { isLoaded } = defineProps<{
	isLoaded: boolean
}>()
</script>
