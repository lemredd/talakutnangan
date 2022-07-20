<template>
<ul class="tabs">
	<li
	v-for="(_, tab) in tabs"
	:key="tab"
	:class="['tab-button', { 'active': currentTab === tab }]"
	>
		<Link
		@click.capture="setCurrentTab(tab)"
		:href="`${fullUrl}/${tab}`">
			{{ (tab as string).charAt(0).toUpperCase() + (tab as string).substring(1) }}
		</Link>
	</li>
</ul>
<component :is="tabs[currentTab]"></component>
</template>

<style lang="scss">
.tabs {
	border-bottom: 1px solid #888;
	padding-bottom: 1em;

	display: flex;
	flex-direction: column;

	.tab-button {
		display: inline;
		border-radius: 5px;
		padding: 0.25em 1em;

		&.active {
			@apply dark:bg-white dark:text-dark-300 bg-dark-300 text-white flex;
			.link.active {
				@apply text-white p-0;
				background: none;
			}
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
import { defineComponent, inject, ref } from "vue"
import { usePageContext } from "#/usePageContext"
import Link from "@/Link.vue"

const url = inject("url") as string
const fullUrl = usePageContext().urlPathname
console.log(fullUrl)
const { tabs } = defineProps<{
	tabs: {
		[key: string]: ReturnType<typeof defineComponent>
	}
}>()

const currentTab = ref(url)

function setCurrentTab(tab: ReturnType<typeof defineComponent>) {
	currentTab.value = tab.toLowerCase()
}
</script>
