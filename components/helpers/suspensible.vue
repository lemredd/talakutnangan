<template>
	<div class="suspensible">
		<div v-if="isLoaded" class="loaded">
			<slot></slot>
		</div>

		<p v-else class="loading">
			<progressBar>
				{{ customMessage ?? "Loading..." }}
			</progressBar>
		</p>
	</div>
</template>

<style scoped>
</style>

<script setup lang="ts">
import progressBar from "@/helpers/progress_bar.vue"

defineProps<{
	isLoaded: boolean
	customMessage?: string
}>()
</script>
