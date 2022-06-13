<template>
	<a :class="{ active: pageContext.urlPathname === $attrs.href }">
		<slot />
	</a>
</template>
<style scoped>
a {
	padding: 3px 10px;
	display: flex;
	align-items: center;
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
