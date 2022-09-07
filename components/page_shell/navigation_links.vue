<template>
	<!-- TODO: Refactor all WindiCSS inline classes using @apply directive -->
	<Dropdown
		class="links mobile"
		@toggle="toggleRoleLinks"
		@resize="toggleRoleLinks">
		<template #toggler>
			<span id="menu-btn" class="material-icons">menu</span>
		</template>

		<template #dropdown-contents>
			<div class="mobile-role-links">
				<Anchor
					v-for="link in mobileRoleLinks"
					:key="link.name"
					:href="link.path">
					<span class="material-icons">
						{{ link.icon }}
					</span>
					<span class="link-name">{{ link.name }}</span>
				</Anchor>
				<LogOutBtn class="mobile-log-out"/>
			</div>
		</template>
	</Dropdown>

	<div class="links desktop">
		<Anchor
			v-for="link in desktopRoleLinks"
			:key="link.name"
			:href="link.path">
			<span class="material-icons">
				{{ link.icon }}
			</span>
		</Anchor>
	</div>
</template>

<style lang="scss">
body.unscrollable {
	overflow-y: hidden;
}
</style>

<style lang="scss">
.links {
	height: 100%;

	&.mobile {
		@apply flex items-center;
	}
	&.desktop {
		display: none;
	}

	.dropdown-container {
		position: fixed;
		inset: 56px 0 0;
	}

	.mobile-role-links {
		@flex flex-col
		height: calc(100% - 56px);

		.overlay {
			position: absolute;
			width: 100%;
			height: 100vh;
			z-index: -1;
		}

		.anchor {
			padding: .5em;

			.material-icons {
				margin-right: .5em;
			}

		}
	}
	#logout-btn {
		border-radius: 5px;
		padding: .5em 1em;
	}

	.account-controls {
		padding-left: 1em;
	}
}

@media (min-width: 640px) {
	.links{
		&.mobile {
			display: none;
		}
		&.desktop {
			@apply flex;

			.anchor[href="/settings"], .anchor[href="/notifications"] {
				display: none;
			}
		}
	}
}
</style>

<script setup lang="ts">
import { computed, inject, Ref } from "vue"

import type { DeserializedPageContext } from "$@/types/independent"

import sanitizeArray from "$@/helpers/sanitize_array"
import filterLinkInfo from "$@/helpers/filter_link_infos"
import RequestEnvironment from "$/helpers/request_environment"

import linkInfos from "@/page_shell/navigation_link_infos"

import Anchor from "@/anchor.vue"
import Dropdown from "@/page_shell/dropdown.vue"
import LogOutBtn from "@/authentication/log_out_btn.vue"

const emit = defineEmits([ "toggle" ])
const pageContext = inject("pageContext") as DeserializedPageContext

// Role
const roleLinks = computed(() => filterLinkInfo(pageContext, linkInfos))

const mobileRoleLinks = computed(() => roleLinks.value.filter(
	info => info.viewportsAvailable.includes("mobile")
))
const desktopRoleLinks = computed(() => roleLinks.value.filter(
	info => info.viewportsAvailable.includes("desktop")
))

const rawBodyClasses = inject("bodyClasses") as Ref<string[]>

function disableScroll() {
	const bodyClasses = Array.from(rawBodyClasses.value)
	if (bodyClasses.includes("unscrollable")) {
		delete bodyClasses[bodyClasses.indexOf("unscrollable")]
	} else {
		bodyClasses.push("unscrollable")
	}

	rawBodyClasses.value = sanitizeArray(bodyClasses)
}

function toggleRoleLinks() {
	if (RequestEnvironment.isOnTest) emit("toggle")
	disableScroll()
}
</script>
