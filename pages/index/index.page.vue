<template>
	<div>
		<Opening/>
		<Instructions/>
		<ChangePassword v-if="isLoggedIn"/>
	</div>
</template>

<script lang="ts" setup>
import { usePageContext } from "#/usePageContext"

import type { PageContext } from "$/types/renderer"

import Opening from "@/guest_homepage/Opening.vue"
import Instructions from "@/guest_homepage/Instructions.vue"
import ChangePassword from "@/authentication/change_password.vue"

const { pageProps } = usePageContext() as PageContext<"serialized">
const { userProfile } = pageProps

const isLoggedIn = userProfile === null
</script>
