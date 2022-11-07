<template>
	<div class="navigation">
		<div class="wrapper">
			<a href="/" class="logo">
				<img src="@assets/logo_navbar.svg" alt="logo"/>
				<h1 class="ml-1">TALAKUTNANGAN</h1>
			</a>

			<CommonNavigationLinks/>
			<Dropdown
				v-if="!isUserAGuest"
				:is-dropdown-shown="mustShowSettings"
				class="user-settings"
				@toggle="toggleSettingsDedicatedly"
				@resize="toggleSettingsDedicatedly">
				<template #toggler>
					<span class="material-icons" title="Settings">account_circle</span>
				</template>
				<template #dropdown-contents>
					<ul class="settings-items">
						<Anchor href="/settings/account">
							<span class="material-icons">settings</span>
							<span class="label anchor-label">Account Settings</span>
						</Anchor>
						<Anchor href="/settings/profile">
							<span class="material-icons">person</span>
							<span class="label anchor-label">Profile Settings</span>
						</Anchor>
						<LogOutBtn/>
					</ul>
				</template>
			</Dropdown>
		</div>
	</div>
</template>

<style lang="scss">
@import "@styles/variables.scss";

.navigation {
	@apply dark:bg-dark-700 flex justify-center;
	position: fixed;
	left: 0; right: 0;
	z-index: 1;
	background-color: white;

	margin: 0 auto;
	border-bottom: 1px solid hsla(0,0%,0%, 0.1);
	padding: 0 .75em;

	height: $navHeight;

	.wrapper {
		@apply grid grid-cols-[1fr,repeat(3,min-content)] flex-1;
	}

	.logo {
		@apply flex items-center sm:flex-row max-w-30;

		padding: .25em;

		img {
			width: 48px;
			padding: .5em;
		}
	}
}

.notifications, .user-settings {
	display: none;
}

@media screen and (min-width: $desktopViewportMinimum) {
	.user-settings {
		@apply pt-6px;
		@apply self-center;

		.settings-items {
			@apply text-sm;
			text-transform: uppercase;
		}

		&.parent-dropdown-container {
			@apply flex items-center;

			.dropdown-container {
				right: 0;
				transform: none;
				left: unset;
			}
		}
	}
}
</style>

<script setup lang="ts">
import { inject, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserProfile } from "$/types/documents/user"

import makeSwitch from "$@/helpers/make_switch"

import Anchor from "@/helpers/anchor.vue"
import Dropdown from "@/page_shell/dropdown.vue"
import LogOutBtn from "@/authentication/log_out_btn.vue"
import CommonNavigationLinks from "@/page_shell/navigation_links.vue"

const { pageProps } = inject("pageContext") as PageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile|null

const isUserAGuest = computed(() => userProfile === null)


const {
	"state": mustShowSettings,
	"toggle": toggleSettings
} = makeSwitch(false)


function toggleSettingsDedicatedly() {
	toggleSettings()
}

</script>
