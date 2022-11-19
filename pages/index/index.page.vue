<template>
	<div v-if="isInMaintenance">
		<Opening/>
		<Instructions/>
		<ChangePassword v-if="hasDefaultPassword"/>
	</div>
	<div v-else>
		<div>
			<p>The application is in maintenance mode.</p>
			<p>Possible reason is due to updates being applied to the system like security updates.</p>
			<p>Another reason is to defend from detected DDOS attacks.</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { inject } from "vue"

import type { PageContext } from "$/types/renderer"

import isUndefined from "$/type_guards/is_undefined"

import Opening from "@/guest_homepage/opening.vue"
import Instructions from "@/guest_homepage/instructions.vue"
import ChangePassword from "@/authentication/change_password.vue"

const { pageProps } = inject("pageContext") as PageContext<"deserialized">
const { userProfile, isInMaintenance } = pageProps

const hasDefaultPassword = userProfile !== null
	&& !isUndefined(userProfile.meta.hasDefaultPassword)
	&& userProfile.meta.hasDefaultPassword
</script>
