<template>
	<div v-if="isInMaintenance">
		<Opening/>
		<Instructions/>
		<ChangePassword v-if="hasDefaultPassword"/>
	</div>
	<MaintenanceMessage v-else/>
</template>

<script lang="ts" setup>
import { inject } from "vue"

import type { PageContext } from "$/types/renderer"

import isUndefined from "$/type_guards/is_undefined"

import Opening from "@/guest_homepage/opening.vue"
import Instructions from "@/guest_homepage/instructions.vue"
import ChangePassword from "@/authentication/change_password.vue"
import MaintenanceMessage from "@/helpers/maintenance_message.vue"

const { pageProps } = inject("pageContext") as PageContext<"deserialized">
const { userProfile, isInMaintenance } = pageProps

const hasDefaultPassword = userProfile !== null
	&& !isUndefined(userProfile.meta.hasDefaultPassword)
	&& userProfile.meta.hasDefaultPassword
</script>
