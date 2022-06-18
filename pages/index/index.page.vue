<template>

	<Opening></Opening>
	<Instructions/>
	<p>Page properties: {{ JSON.stringify(pageProps) }}</p>

</template>
<script lang="ts" setup>
import Opening from "@/Opening.vue"
import Instructions from "@/Instructions.vue"
import { usePageContext } from "#/usePageContext"

const pageProps = usePageContext().pageProps
</script>
