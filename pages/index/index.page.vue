<template>

	<Opening></Opening>
	<Instructions/>
	<p>Page properties: {{ JSON.stringify(pageProps) }}</p>

</template>
<script lang="ts" setup>
import Opening from "@/guest_homepage/Opening.vue"
import Instructions from "@/guest_homepage/Instructions.vue"
import { usePageContext } from "#/usePageContext"

const pageProps = usePageContext().pageProps
</script>
