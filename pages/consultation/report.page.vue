<template>
	hello
</template>

<style>

</style>

<script setup lang="ts">
import { inject } from "vue"

import type { PageContext } from "$/types/renderer"

const pageContext = inject("pageContext") as PageContext<"deserialized", "consultations">
console.log(pageContext.pageProps.consultations)
</script>
