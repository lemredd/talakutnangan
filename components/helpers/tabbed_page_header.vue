<template>
	<div>
		<header>
			<h1>{{ title }}</h1>
		</header>

		<main>
			<Tabs :tabs="tabs" class="main-controls"/>

			<div class="additional-controls">
				<slot name="additional-controls"></slot>
			</div>
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

	main {
		@apply flex justify-between items-center;

		.additional-controls {
			padding-bottom: 1em;
		}
	}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { ConditionalLinkInfo } from "$@/types/independent"

import filterLinkInfo from "$@/helpers/filter_link_infos"

import Tabs from "@/helpers/tabbed_page_header/tabs.vue"

const props = defineProps<{
	title: string,
	tabInfos: ConditionalLinkInfo<any, any>[]
}>()

const pageContext = inject("pageContext") as PageContext<"deserialized">

const tabs = computed(() => filterLinkInfo(pageContext, props.tabInfos))
</script>
