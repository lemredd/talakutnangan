<template>
	<img :src="profilePictureURL"/>
</template>

<script setup lang="ts">
import { computed } from "vue"

import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import Icon from "@assets/icon.png"
import hasProfilePicture from "@/helpers/profile_picture/has_uploaded_profile_picture"

const props = defineProps<{
	activity: DeserializedChatMessageActivityResource<"user">
}>()

const { user } = props.activity
const profilePictureURL = computed(() => {
	const { profilePicture } = user.data

	if (hasProfilePicture(profilePicture)) {
		return profilePicture.data.fileContents
	}

	return Icon
})
</script>
