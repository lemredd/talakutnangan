<template>
	<img :src="profilePictureURL"/>
</template>

<script setup lang="ts">
import { computed } from "vue"

import { DeserializedUserDocument } from "$/types/documents/user"

import Icon from "@assets/icon.png"
import hasProfilePicture from "@/helpers/profile_picture/has_uploaded_profile_picture"

const props = defineProps<{
	user: DeserializedUserDocument
}>()

const profilePictureURL = computed(() => {
	const { profilePicture } = props.user.data

	if (hasProfilePicture(profilePicture)) {
		return profilePicture.data.fileContents
	}

	return Icon
})
</script>
