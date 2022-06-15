<template>
	<h1>Welcome</h1>
	This page is:
	<ul>
		<li>Rendered to HTML.</li>
		<li>Interactive. <Counter /></li>
	</ul>

	<p>Page properties: {{ JSON.stringify(pageProps) }}</p>
</template>

<script lang="ts" setup>
import Counter from "@@/index/Counter.vue"
import { usePageContext } from "#/usePageContext"

const pageProps = usePageContext().pageProps
</script>
