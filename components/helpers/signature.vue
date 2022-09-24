<template>
	<img :src="signatureURL"/>
</template>

<style scoped lang="scss">
	img {
		border-radius: 8px;
	}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedSignatureDocument } from "$/types/documents/signature"
import { PageContext } from "$/types/renderer"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const user = pageContext.pageProps.userProfile as DeserializedUserDocument

function isDeserializedSignatureDocument(value: any)
: value is DeserializedSignatureDocument {
	return typeof value === "object"
}

const signatureURL = computed(() => {
	const { signature } = user.data

	if (isDeserializedSignatureDocument(signature)) {
		return signature.data.fileContents
	}

	return ""
})
</script>
