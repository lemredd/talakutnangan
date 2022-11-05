<template>
	<Dropdown
		class="links mobile"
		:is-dropdown-shown="mustShowMobileMenu"
		@toggle="toggleMobileMenu"
		@resize="toggleMobileMenu">
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
				<LogOutBtn v-if="isUserLoggedIn" class="mobile-log-out"/>
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
	&.mobile {
		@apply flex items-center;
	}
	&.desktop {
		display: none;
	}

	.mobile-role-links {
		@apply flex flex-col;
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

	.account-controls {
		padding-left: 1em;
	}
}
@screen sm {
	.links{
		&.mobile {
			display: none;
		}
		&.desktop {
			@apply flex;
		}
	}
}
</style>

<script setup lang="ts">
import { computed, inject, Ref } from "vue"

import type { PageContext } from "$/types/renderer"

import { BODY_CLASSES } from "$@/constants/provided_keys"

import makeSwitch from "$@/helpers/make_switch"
import filterLinkInfo from "$@/helpers/filter_link_infos"
import BodyCSSClasses from "$@/external/body_css_classes"
import linkInfos from "@/page_shell/navigation_link_infos"
import RequestEnvironment from "$/singletons/request_environment"

import Anchor from "@/helpers/anchor.vue"
import Dropdown from "@/page_shell/dropdown.vue"
import LogOutBtn from "@/authentication/log_out_btn.vue"

const emit = defineEmits([ "toggle" ])
const pageContext = inject("pageContext") as PageContext<"deserialized">
const { "pageProps": { userProfile } } = pageContext
const isUserLoggedIn = Boolean(userProfile)

// Role
const roleLinks = computed(() => filterLinkInfo(pageContext, linkInfos))

const mobileRoleLinks = computed(() => roleLinks.value.filter(
	info => info.viewportsAvailable.includes("mobile")
))
const desktopRoleLinks = computed(() => roleLinks.value.filter(
	info => info.viewportsAvailable.includes("desktop")
))

const bodyClasses = inject(BODY_CLASSES) as Ref<BodyCSSClasses>
const {
	"state": mustShowMobileMenu,
	"toggle": toggleVisibility
} = makeSwitch(false)

function toggleMobileMenu() {
	if (RequestEnvironment.isOnTest) emit("toggle")
	toggleVisibility()
	bodyClasses.value.scroll(!mustShowMobileMenu.value)
}
</script>
