<template>
	<Instructions/>
	<p>Page properties: {{ JSON.stringify(pageProps) }}</p>
</template>

<script lang="ts" setup>
import Instructions from "@/Instructions.vue"
import { usePageContext } from "#/usePageContext"

const pageProps = usePageContext().pageProps
</script>
