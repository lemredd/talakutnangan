<template>
	<ProfilePicture :user="activity.user"/>
</template>

<script setup lang="ts">
import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import ProfilePicture from "@/helpers/profile_picture.vue"

const {
	activity
} = defineProps<{
	activity: DeserializedChatMessageActivityResource<"user">
}>()
</script>
