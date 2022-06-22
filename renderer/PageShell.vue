<template>
	<div class="layout" ref="layout">
		<ShellNav />
		<Content>
			<slot/>
		</Content>
		<Footer />
	</div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, watch } from "vue"
import ShellNav from "@/PageShell/ShellNav.vue"
import Content from "@/PageShell/Content.vue"
import Footer from "@/Footer.vue"
import { usePageContext } from "#/usePageContext"

const pageContext = usePageContext()
const path = pageContext.urlPathname
const isLoggingIn = path === "/log_in"
provide("isLoggingIn", isLoggingIn)

const layout = ref<HTMLElement | null>(null)
const body = ref<HTMLBodyElement | null>(null)
const bodyClasses = ref<string[]>(["dark"])
onMounted(function() {
	if (layout.value) {
		// ! Risky
		body.value = layout.value.parentElement!.parentElement as HTMLBodyElement
	}
})
watch(bodyClasses, newSource => {
	body.value!.classList.remove(...body.value!.classList.values())
	body.value!.classList.add(...newSource)
})
provide("pageContext", pageContext)
provide("bodyClasses", bodyClasses)
</script>

<style lang="scss">
@import 'material-icons/iconfont/material-icons.css';
@import "@styles/variables.scss";

body {
	margin: 0;
	font-family: sans-serif;
}
*, *::before, *::after {
	box-sizing: border-box;
}
a {
	text-decoration: none;
}

.layout {
	display: flex;
	flex-direction: column;

	.content {
		margin-top: $nav-height;
		padding: 20px;
		min-height: calc(100vh - $nav-height);

		&.login-content {
			margin-top: 0;
			padding: 0;
			.container {
				max-width: none;
			}

			footer {
				display: none;
			}
		}
	}
}

.container {
	max-width: 900px;
	margin: auto;
}
</style>
