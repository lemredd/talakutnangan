<template>
	<div>
		<Opening/>
		<Instructions/>
		<ChangePassword/>
	</div>
</template>

<script lang="ts" setup>
import { usePageContext } from "#/usePageContext"

import Opening from "@/guest_homepage/Opening.vue"
import Instructions from "@/guest_homepage/Instructions.vue"
import ChangePassword from "@/authentication/change_password.vue"

const { "pageProps": unusedPageProps } = usePageContext()
</script>
