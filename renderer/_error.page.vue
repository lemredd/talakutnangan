<template>
	<div v-if="is404">
		<h1>404 Page Not Found</h1>
		<p>This page could not be found.</p>
	</div>
	<div v-else>
		<h1>500 Internal Server Error</h1>
		<p>Something went wrong.</p>
	</div>
	<p>
		JSON: {{ JSON.stringify(pageContext.pageProps) }}
	</p>
</template>

<script lang="ts" setup>
import { usePageContext } from "#/usePageContext"

defineProps(["is404"])

const pageContext = usePageContext()
</script>
