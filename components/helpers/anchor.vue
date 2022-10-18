<template>
	<a class="anchor" :class="{ active: pageContext.urlPathname === $attrs.href }">
		<slot></slot>
	</a>
</template>
<style scoped lang="scss">
	a {
		@apply flex items-center px-3px py-10px;
	}

	a.active {
		@apply dark:bg-[#eee] dark:text-[#222] bg-dark-300 text-white;
	}
</style>
<script lang="ts" setup>
import { PageContext } from "$/types/renderer"
import { inject } from "vue"

const pageContext = inject("pageContext") as PageContext
</script>
