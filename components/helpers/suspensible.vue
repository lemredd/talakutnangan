<template>
	<div class="suspensible">
		<div v-if="isLoaded" class="loaded">
			<slot></slot>
		</div>

		<p v-else class="loading">
			{{ customMessage ?? "Loading..." }}
		</p>
	</div>
</template>

<style>
</style>

<script setup lang="ts">
defineProps<{
	isLoaded: boolean
	customMessage?: string
}>()
</script>
