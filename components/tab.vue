<template>
	<ul class="tabs">
		<li
			v-for="tab in tabs"
			:key="tab"
			class="tab-button">
			<Anchor
				class="tab-link"
				:href="`${parentUrl}/${tab.toLowerCase()}`">
				{{ tab }}
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
import { inject } from "vue"
import Anchor from "@/anchor.vue"
import { PageContext } from "$/types/renderer"

const pageContext = inject("pageContext") as PageContext
const tabs = inject("tabs") as string[]

const fullUrl = pageContext.urlPathname
const splittedUrl = fullUrl!.split("/")
splittedUrl.shift()
const currentTab = splittedUrl[splittedUrl.length - 1]

let parentUrl = ""
splittedUrl.forEach(word => {
	if (word !== currentTab) parentUrl += `/${word}`
})
</script>
