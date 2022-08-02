<template>
	<a class="link" :class="{ active: pageContext.urlPathname === $attrs.href }">
		<slot />
	</a>
</template>
<style scoped lang="scss">
a {
	@apply flex items-center;
	padding: 3px 10px;
}
a.active {
	background-color: #eee;
	color: #222;
}
</style>
<script lang="ts" setup>
import { PageContext } from "#/types"
import { inject } from "vue"

const pageContext = inject("pageContext") as PageContext
</script>
