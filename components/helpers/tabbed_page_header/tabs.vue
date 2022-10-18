<template>
	<ul class="tabs">
		<li
			v-for="tab in tabs"
			:key="tab.label"
			class="tab-button">
			<Anchor
				class="tab-link"
				:href="`${tab.path}`">
				{{ tab.label }}
			</Anchor>
		</li>
	</ul>
</template>

<style scoped lang="scss">
	.tabs {
		border-bottom: 1px solid #888;
		padding-bottom: 1em;

		display: flex;
		flex-direction: column;

		.tab-button {
			display: inline;
			border-radius: 5px;
			padding: 0.25em 1em;

			.tab-link {
				padding: .5em 1em;
			}
		}
	}

	@media (min-width: 640px) {
		.tabs {
			flex-direction: row;
		}
	}
</style>

<script setup lang="ts">
import type { TabInfo } from "$@/types/component"

import Anchor from "@/helpers/anchor.vue"

defineProps<{
	tabs: TabInfo[]
}>()
</script>
