<template>
<ul class="tabs">
	<li>
		<Link 
		v-for="(_, tab) in tabs"
		:key="tab"
		:class="['tab-button', { 'active': currentTab === tab }]"
		@click="setCurrentTab(tab)"
		:href="`/admin_settings/${tab}`">
			{{ tab }}
		</Link>
	</li>
</ul>
<component :is="tabs[currentTab]" class="tab"></component>
</template>

<style scoped lang="scss">
.tabs {
	border-bottom: 1px solid #888;
	padding-bottom: 1em;

	display: flex;

	.tab-button {
		display: inline;
		border-radius: 5px;
		cursor: pointer;
		padding: 0.25em 2em;

		&.active {
			@apply dark:bg-white dark:text-dark-300 bg-dark-300 text-white;
		}
	}
}
</style>

<script setup lang="ts">
import { defineComponent, ref } from "vue"
import { usePageContext } from "#/usePageContext"
import Link from "@/Link.vue"

const url = usePageContext().routeParams!.tab
const { tabs } = defineProps<{
	tabs: {
		[key: string]: ReturnType<typeof defineComponent>
	}
}>()

const currentTab = ref(url)

function setCurrentTab(tab: ReturnType<typeof defineComponent>) {
	console.log(url)
	currentTab.value = `/admin_settings/${tab}`
}
</script>
