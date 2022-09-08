<template>
	<div>
		<header>
			<h1>{{ title }}</h1>
		</header>

		<main>
			<Tab/>
		</main>
	</div>
</template>

<style scoped lang="scss">
header {
	margin-bottom: 1.25em;

	h1 {
		margin: 1.25em 0;
		font-size: 1.75em;
		text-transform: uppercase;
	}
}
</style>

<script setup lang="ts">
import Tab from "@/tab.vue"

const { title } = defineProps<{ title: string }>()
</script>
