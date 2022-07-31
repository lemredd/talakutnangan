<template>
<ul class="tabs">
	<li v-for="tab in tabs" class="tab-button">
		<Anchor
			:href="`${parentUrl}/${tab.toLowerCase()}`">
			{{ tab }}
		</Anchor>
	</li>
</ul>
</template>

<style lang="scss">
.link {
	padding: .5em 1em !important;
}
</style>

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
import Anchor from "@/anchor.vue"
import { PageContext } from "#/types"

const pageContext = inject("pageContext") as PageContext
const tabs = inject("tabs") as string[]

const fullUrl = pageContext.urlPathname
const parentUrl = pageContext.urlPathname!.charAt(0) + pageContext.urlPathname!.substring(1, pageContext.urlPathname!.substring(1).indexOf("/") + 1)
</script>
