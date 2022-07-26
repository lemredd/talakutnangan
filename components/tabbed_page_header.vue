<template>
<div>
	<header>
		<h1>User Settings</h1>
	</header>

	<main>
		<Tab :tabs="tabs" />
	</main>
</div>
</template>

<style scoped lang="scss">
header {
	margin-bottom: 1.25em;

	h1 {
		margin: 1.25em 0;
		font-size: 1.75em;
		text-transform: uppercase;
	}
}
</style>

<script setup lang="ts">
import { provide, ref } from "vue"
import Tab from "@/tab.vue"
import { usePageContext } from "#/usePageContext"
import deserializedPageProps from "$@/helpers/deserialize_page_props"
const pageContext = usePageContext()
provide("pageContext", pageContext)

const tabs = ref([
	"Account", "Profile"
])

const roles = ["student", "employee"]
const role = roles[0]
const userInfo = ref({
	account: {
		email: "sample@sample.com",
		password: "password123",
		institute: "Institute of Name",
		role: role,
		studentNumber: "1920-xxxx",
	},
	profile: {
		displayName: "Sample Display F. Name",
		profilePic: null,
		signature: null,
		prefersDarkMode: true
	}
})

provide("userInfo", userInfo)
provide("url", pageContext.routeParams!.tab)
</script>
