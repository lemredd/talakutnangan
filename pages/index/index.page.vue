<template>
	<div>
		<Opening/>
		<Instructions/>
		<ChangePassword v-if="hasDefaultPassword"/>
	</div>
</template>

<script lang="ts" setup>
import { inject } from "vue"

import type { PageContext } from "$/types/renderer"

import isUndefined from "$/type_guards/is_undefined"

import Opening from "@/guest_homepage/Opening.vue"
import Instructions from "@/guest_homepage/Instructions.vue"
import ChangePassword from "@/authentication/change_password.vue"

const { pageProps } = inject("pageContext") as PageContext<"deserialized">
const { userProfile } = pageProps

const hasDefaultPassword = userProfile !== null && !isUndefined(userProfile.meta.hasDefaultPassword)
</script>
