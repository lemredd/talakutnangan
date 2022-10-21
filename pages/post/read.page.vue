<template>
	<div class="post-container">
	</div>
</template>

<style lang="scss">
</style>

<script setup lang="ts">
import { provide, inject, ref, readonly, computed, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"

import makeSwitch from "$@/helpers/make_switch"

type RequiredExtraProps =
	| "userProfile"
	| "post"
	| "comment"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const { userProfile } = pageProps

</script>
