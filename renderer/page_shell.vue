<template>
	<div ref="layout" class="layout">
		<ShellNav/>
		<Content>
			<slot></slot>
		</Content>
		<Footer/>
	</div>
</template>

<style lang="scss">
@import 'material-icons/iconfont/material-icons.css';
@import "@styles/variables.scss";

body {
	margin: 0;
	font-family: sans-serif;

	&.dark #app {
		@apply text-light-50 bg-dark-700;

	}
}
*, *::before, *::after {
	box-sizing: border-box;
}
a {
	text-decoration: none;
}

.layout {
	@apply flex flex-col;
}

.container {
	max-width: 900px;
	margin: auto;
}
</style>

<script lang="ts" setup>
import { onMounted, provide, ref, watch } from "vue"

import { usePageContext } from "#/usePageContext"
import deserializedPageProps from "$@/helpers/deserialize_page_props"

import Footer from "@/page_shell/footer.vue"
import ShellNav from "@/page_shell/shell_nav.vue"
import Content from "@/page_shell/content_container.vue"

const pageContext = usePageContext()
const path = pageContext.urlPathname
const isLoggingIn = path === "/log_in"
provide("isLoggingIn", isLoggingIn)

const layout = ref<HTMLElement | null>(null)
const body = ref<HTMLBodyElement | null>(null)
const bodyClasses = ref<string[]>([])
onMounted(() => {
	if (layout.value) {
		// ! Risky
		body.value = layout.value.parentElement?.parentElement as HTMLBodyElement
	}
})
watch(bodyClasses, newSource => {
	body.value?.classList.remove(...body.value?.classList.values() ?? [])
	body.value?.classList.add(...newSource)
})
provide("pageContext", deserializedPageProps(pageContext))
provide("bodyClasses", bodyClasses)
</script>
