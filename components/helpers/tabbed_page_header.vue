<template>
	<div>
		<header>
			<h1>{{ title }}</h1>
		</header>

		<main>
			<Tabs :tabs="tabs"/>
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
import type { TabInfo } from "$@/types/component"

import Tabs from "@/helpers/tabbed_page_header/tabs.vue"

defineProps<{
	title: string,
	tabs: TabInfo[]
}>()
</script>
