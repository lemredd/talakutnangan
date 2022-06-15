<template>
	<div class="layout" ref="layout">
		<div v-if="!isLoggingIn" class="navigation dark:bg-dark-700">
			<div class="container">
				<a href="/" class="logo">
					<img src="./placeholder.svg" alt="logo" />
					<h1 class="ml-1">TALAKUTNANGAN</h1>
				</a>

				<!-- <Notifications v-if="!isRoleGuest"></Notifications> -->
				<RoleSpecificLinks :role="role"/>
			</div>

		</div>
		<div class="content" :class="{ 'login-content': isLoggingIn }">
			<div class="container">
				<slot />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, watch } from "vue"
import RoleSpecificLinks from '@/PageShell/RoleSpecificLinks.vue'
import { usePageContext } from "#/usePageContext"

const pageContext = usePageContext()
const path = pageContext.urlPathname
const isLoggingIn = path === "/log_in"
const roles = ["guest", "student_or_employee", "user_manager", "admin"]
const role = roles[2]
const isRoleGuest = role === "guest"

const layout = ref<HTMLElement | null>(null)
const body = ref<HTMLBodyElement | null>(null)
onMounted(function() {
	if (layout.value) {
		body.value = layout.value.parentElement?.parentElement as HTMLBodyElement
	}
})

provide("pageContext", pageContext)
provide("bodyClasses", bodyClasses)
watch(bodyClasses, newSource => {
	body.value!.classList.remove(...body.value!.classList.values())
	body.value!.classList.add(...newSource)
})
</script>

<style>
@import 'material-icons/iconfont/material-icons.css';

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
</style>

<style scoped lang="scss">
.layout {
	display: flex;
	flex-direction: column;

	.navigation {
		position: fixed;
		left: 0; right: 0;
		padding: 0 .75em;
		flex-shrink: 0;
		line-height: 1.8em;
		box-shadow: 0 4px 10px rgba(0,0,0,0.5);

		.container {
			display: grid;
			grid-template-columns: 1fr min-content min-content;
		}

		.logo {
			padding: .25em;
			display: flex;
			align-items: center;
			width: max-content;

			img {
				width: 48px;
				padding: .5em;
			}
		}
	}

	.content {
		margin-top: 56px;
		padding: 20px;
		min-height: calc(100vh - 56px);

		&.login-content {
			padding: 0;
			.container {
				max-width: none;
			}
		}
	}
}

.container {
	max-width: 900px;
	margin: auto;

}
</style>
