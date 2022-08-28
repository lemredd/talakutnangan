<template>
	<img :src="profilePictureURL"/>
</template>
<script setup lang="ts">
import { computed } from "vue"

import type { DeserializedProfilePictureDocument } from "$/types/documents/profile_picture"
import type {
	ChatMessageActivityRelationshipNames,
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"
import Icon from "@assets/icon.png"

const {
	activity
} = defineProps<{
	activity: DeserializedChatMessageActivityResource<ChatMessageActivityRelationshipNames>
}>()

function isDeserializedProfilePictureDocument(value: any)
: value is DeserializedProfilePictureDocument {
	return typeof value === "object"
}

const profilePictureURL = computed(() => {
	const { profilePicture } = activity.user.data.profilePicture

	if (isDeserializedProfilePictureDocument(profilePicture)) {
		return profilePicture.data.fileContents
	}

	return Icon
})
</script>
