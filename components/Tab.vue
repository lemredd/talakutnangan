<template>
<ul class="tabs">
	<li v-for="tab in tabs" class="tab-button" :class="{ 'active': fullUrl!.includes(tab.toLowerCase()) }">
		<Link
			:href="`${parentUrl}/${tab.toLowerCase()}`">
			{{ tab }}
		</Link>
	</li>
</ul>
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
import Link from "@/Link.vue"
import { PageContext } from "#/types"

const pageContext = inject("pageContext") as PageContext

const fullUrl = pageContext.urlPathname
const parentUrl = pageContext.urlPathname!.charAt(0) + pageContext.urlPathname!.substring(1, pageContext.urlPathname!.substring(1).indexOf("/") + 1)

console.log(parentUrl)
const { tabs } = defineProps<{
	tabs: string[]
}>()

</script>
