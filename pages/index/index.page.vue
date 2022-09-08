<template>
	<div>
		<Opening/>
		<Instructions/>
	</div>
</template>
<script lang="ts" setup>
import Opening from "@/guest_homepage/Opening.vue"
import Instructions from "@/guest_homepage/Instructions.vue"
import { usePageContext } from "#/usePageContext"

const { "pageProps": unusedPageProps } = usePageContext()
</script>
