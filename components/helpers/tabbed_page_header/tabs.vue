<template>
	<ul class="tabs">
		<li
			v-for="tab in tabs"
			:key="tab.name"
			class="tab-button">
			<Anchor
				class="tab-link"
				:href="`${tab.path}`">
				{{ tab.name }}
			</Anchor>
		</li>
	</ul>
</template>

<style scoped lang="scss">
	.tabs {
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

	@screen md {
		.tabs {
			flex-direction: row;
		}
	}
</style>

<script setup lang="ts">
import type { LinkInfo } from "$@/types/independent"

import Anchor from "@/helpers/anchor.vue"

defineProps<{
	tabs: LinkInfo[]
}>()
</script>
