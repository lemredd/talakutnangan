<template>
	<div class="suspensible">
		<div class="loaded" v-if="isLoaded">
			<slot></slot>
		</div>

		<div class="loading" v-else>
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
// watch(computed(() => asyncResource), () => console.log("loaded reosurce:", asyncResource, "\n\n\n\n"))
</script>
