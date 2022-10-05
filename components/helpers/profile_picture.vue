<template>
	<img :src="profilePictureURL"/>
</template>

<style scoped lang="scss">
	img {
		border-radius: 8px;
	}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { DeserializedUserDocument } from "$/types/documents/user"

import Icon from "@assets/icon.png"
import { PageContext } from "$/types/renderer"
import isDeserializedProfilePictureDocument from "./profile_picture/has_uploaded_profile_picture"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const user = pageContext.pageProps.userProfile as DeserializedUserDocument


const profilePictureURL = computed(() => {
	const { profilePicture } = user.data

	if (isDeserializedProfilePictureDocument(profilePicture)) {
		return profilePicture.data.fileContents
	}

	return Icon
})
</script>
